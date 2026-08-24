/**
 * Fragment shader for the homepage hero's halftone burst, plus the constants the
 * component and cursor controller share with it.
 *
 * The technique: a phyllotaxis (sunflower) lattice of candidate dot centres radiating from
 * `center`, where each fragment finds its nearest dot analytically and sizes it from a
 * luminance field sampled at that dot. A pointer trail locally carries luminance from
 * where the cursor has been into where it is now, and the dot colour animates around a
 * palette of theme tokens.
 *
 * Two luminance fields exist and `fieldMix` chooses between them:
 *
 * - the four-pole mesh (`fieldMix: 0`, the current setting) — dark poles push dots away and
 *   light poles pull them in, drifting on a ping-pong loop. Asymmetric, so one corner can
 *   be emptier than another.
 * - the radial burst (`fieldMix: 1`) — floors near the focal point, peaks in a band partway
 *   out, falls away past the burst radius. Rotationally symmetric by construction.
 *
 * IMPORTANT while `fieldMix` is 0: the burst path is unreachable, so every knob that only
 * feeds it does nothing. That is `floorLuminance`, `coreScale`, `burstRadiusFrac` and
 * `burstScale` — and, because the breathe factor only scales the burst radius,
 * `breatheAmount` and `breathePeriod` too. `edgeFadeAmount` is likewise inert at 0, and
 * setting it above 0 has no effect while the burst radius it measures against is unused.
 * `center` DOES still matter: it is the lattice origin, not just the burst's focal point.
 *
 * Adapted from the Dialpad marketing site's implementation. Its scroll-driven crossfade
 * between the two fields is deliberately not ported — `fieldMix` is a fixed choice here.
 *
 * @module baseComponents/gradientHeroShader
 */

/** Pointer-trail samples the shader unions together. Must match the uniform array size. */
export const TRAIL_LENGTH = 20;

/**
 * Geometry defaults. Lengths suffixed `Css` are CSS pixels and are scaled to the backing
 * buffer inside the shader; see the `u_pixelRatio` note below.
 */
export const HERO_GEOMETRY = Object.freeze({
  dotSpacingCss: 20,
  maxDotSizeCss: 4,
  // Percent of the canvas, y-down. Below the bottom edge, so the burst radiates upward.
  center: Object.freeze([50, 104]),
  burstRadiusFrac: 1.07,
  burstScale: 1,
  coreScale: 1,
  breatheAmount: 0.065,
  breathePeriod: 10,
  // Which luminance field drives dot size: 0 = the drifting four-pole mesh, 1 = the radial
  // burst. The burst is rotationally symmetric by construction, so only the mesh can make
  // one corner emptier than another. The reference crossfades this on scroll; here it is a
  // static choice.
  fieldMix: 0,
  // Seconds for the mesh's poles to travel out and back.
  meshPeriod: 7,
  // Mesh pole travel, in canvas percent, y-down. Each entry is [fromX, fromY, toX, toY]
  // and the pole eases between the two across half the period, then back.
  //
  // Dark poles push dots away; light poles pull them in. So the density of any region is
  // really "how far is it from a light pole relative to a dark one" — to populate a
  // corner, either move a light pole toward it or move a dark pole off it.
  meshDarkPoles: Object.freeze([
    Object.freeze([-10, 20, 2, 100]), // left edge, descends the full height
    Object.freeze([64, 6, 38, 72]), // upper-right, sweeps down and left
  ]),
  meshLightPoles: Object.freeze([
    Object.freeze([14, 108, 44, 90]), // below the bottom edge, drifts inward
    Object.freeze([94, 100, 62, 114]), // bottom-right, converges toward centre
  ]),
  // Divides pole distance before the falloff: larger spreads each pole's reach, so the
  // field reads as one wash; smaller keeps them as distinct lobes.
  meshPointSize: 5.5,
  // Falloff exponent. Higher makes poles more local, which raises the contrast between
  // empty and dense regions; lower flattens the whole field.
  meshSmoothness: 5,
  sizeVariation: 2,
  // How much of the corner-emptying edge fade to apply, 0-1. The reference ramps this in
  // from scroll and sits at 0 while the hero is at rest, which is why its dots reach into
  // the far corners; 1 is its fully-scrolled state, which empties them.
  edgeFadeAmount: 0,
  // Luminance floor outside the burst's reach. Sets how big the far-field dots are, so it
  // is the companion to edgeFadeAmount: without some floor there is nothing out there to
  // reach with.
  floorLuminance: 0.06,
  cursorRadiusFrac: 0.42,
  cursorStrength: 0.85,
});

/*
 * Precision, and why it is spelled out rather than left to the file default:
 *
 * Paper's ShaderMount pairs every fragment shader with one shared vertex shader compiled
 * under `precision mediump float`, and that vertex shader declares `u_resolution` and
 * `u_pixelRatio`. GLSL ES 3.00 requires a uniform used in both stages to carry the same
 * precision in both, so those two must stay mediump here. Declaring them highp links
 * fine under software rendering and then fails to link on real GPU drivers
 * ("Precisions of uniform 'u_resolution' differ between VERTEX and FRAGMENT shaders"),
 * leaving a blank canvas that only shows up on a device.
 *
 * The phyllotaxis maths does need full precision — the golden angle times a
 * several-thousand index is a large argument to sin/cos — so highp is applied to locals
 * inside main() instead, where it costs nothing at link time.
 *
 * Paper supplies u_time, u_resolution and u_pixelRatio itself; everything else here is
 * passed in from the component.
 */
export const gradientHeroFragmentShader = /* glsl */ `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform highp float u_time;

uniform float u_dotSpacingCss;
uniform float u_maxDotSizeCss;
uniform vec2 u_center;
uniform vec4 u_bgColor;
uniform vec4 u_dotColor;
uniform float u_sizeVariation;
uniform float u_burstRadiusFrac;
uniform float u_burstScale;
uniform float u_coreScale;
uniform float u_breatheAmount;
uniform float u_breathePeriod;
uniform float u_edgeFadeAmount;
uniform float u_floorLuminance;
uniform float u_fieldMix;
uniform float u_meshPeriod;
// Each vec4 is one pole's travel: xy = start, zw = end, in canvas percent.
uniform vec4 u_meshDark1;
uniform vec4 u_meshDark2;
uniform vec4 u_meshLight1;
uniform vec4 u_meshLight2;
uniform float u_meshPointSize;
uniform float u_meshSmoothness;

// Normalized 0-1, y-down, relative to the hero box — not pixels, so they do not depend
// on the backing buffer's scale. (-1, -1) means the pointer is absent.
uniform vec2 u_cursorUv;
uniform vec2 u_cursorPrevUv;
uniform float u_cursorRadiusFrac;
uniform float u_cursorStrength;

// Recent pointer path, newest first: xy = normalized position, z = that sample's
// remaining intensity (0 = unused slot). Unioning these makes the effect a streak along
// where the pointer travelled rather than an orb pinned to it.
#define TRAIL_N ${TRAIL_LENGTH}
uniform vec4 u_trail[TRAIL_N];

out vec4 fragColor;

#define PI 3.14159265359

// sizeVariation <= 1 fades between "every dot at full size" and "dot size inverse to
// luminance"; above 1 it crosses over to dot size tracking luminance directly.
float computeSizeFactor (float lum, float sizeVariation) {
  float factor;
  if (sizeVariation <= 1.0) {
    factor = mix(1.0, 1.0 - lum, sizeVariation);
  } else {
    factor = mix(1.0 - lum, lum, sizeVariation - 1.0);
  }

  return max(0.0, factor);
}

// Radial burst luminance, sampled at a candidate dot's exact centre. Floors near the
// focal point, peaks in a band partway out, floors again further out so faint dots
// persist instead of ending on a hard cutoff.
float burstLuminance (vec2 p, vec2 centerPx, float burstRadiusPx) {
  float radialFrac = length(p - centerPx) / max(burstRadiusPx, 0.0001);
  float floorLum = clamp(u_floorLuminance, 0.0, 1.0);
  float peak = 0.275 * u_coreScale;
  // Hold the core at the floor out to half the peak radius before ramping. Ramping from
  // dead centre instead leaves the core a slow gradient with no perceptible boundary.
  float inner = smoothstep(peak * 0.5, peak, radialFrac);
  float outer = 1.0 - smoothstep(peak, 1.0, radialFrac);
  float bump = clamp(min(inner, outer), 0.0, 1.0);

  return floorLum + (1.0 - floorLum) * bump;
}

// Four-pole mesh: two dark poles and two light ones drift out and back on a ping-pong
// loop, and each fragment takes an inverse-distance-weighted blend of them. Because the
// poles sit at asymmetric positions the field is asymmetric — dark regions read as empty
// and light ones as dense, and which corner is which changes across the loop.
//
// Approximated from the reference, which notes it is itself an approximation rather than
// the original source shader.
//
// The distances and weights are explicitly highp and the distance is floored well above
// zero. 1/d^smoothness climbs fast: at the floor a weight reaches ~8.8e5, past the fp16
// mediump ceiling of 65504. On a GPU with true fp16 that goes Inf, the sum goes Inf and
// the blend goes NaN, blanking every dot near a pole. Desktop drivers promote mediump to
// fp32 and hide it entirely.
float meshLuminance (vec2 uvPct, float t) {
  float period = max(u_meshPeriod, 0.0001);
  float halfPeriod = period * 0.5;
  float loopT = mod(t, period);
  float segT = loopT < halfPeriod
    ? smoothstep(0.0, 1.0, loopT / halfPeriod)
    : 1.0 - smoothstep(0.0, 1.0, (loopT - halfPeriod) / halfPeriod);

  vec2 dark1 = mix(u_meshDark1.xy, u_meshDark1.zw, segT);
  vec2 dark2 = mix(u_meshDark2.xy, u_meshDark2.zw, segT);
  vec2 light1 = mix(u_meshLight1.xy, u_meshLight1.zw, segT);
  vec2 light2 = mix(u_meshLight2.xy, u_meshLight2.zw, segT);

  float pointSize = max(u_meshPointSize, 0.0001);
  float smoothness = max(u_meshSmoothness, 0.0001);

  vec2 uv = (uvPct - 50.0) / 100.0;
  highp float d1 = max(distance(uv, (dark1 - 50.0) / 100.0) / pointSize, 0.02);
  highp float d2 = max(distance(uv, (dark2 - 50.0) / 100.0) / pointSize, 0.02);
  highp float d3 = max(distance(uv, (light1 - 50.0) / 100.0) / pointSize, 0.02);
  highp float d4 = max(distance(uv, (light2 - 50.0) / 100.0) / pointSize, 0.02);

  highp float w1 = 1.0 / pow(d1, smoothness);
  highp float w2 = 1.0 / pow(d2, smoothness);
  highp float w3 = 1.0 / pow(d3, smoothness);
  highp float w4 = 1.0 / pow(d4, smoothness);

  // The reference blends black and white vec3s and takes their luma. The luma
  // coefficients sum to 1 and the colour is grey, so this is the same number: the light
  // poles' share of the total weight.
  return (w3 + w4) / max(w1 + w2 + w3 + w4, 0.0001);
}

// Blends between the two fields. The reference sweeps the handover outward from the focal
// point because it is animating the transition; a plain mix is used here since this is a
// fixed setting, and the endpoints resolve to pure mesh / pure burst either way.
float fieldLuminance (vec2 posPx, vec2 dims, vec2 centerPx, float burstRadiusPx) {
  float t = clamp(u_fieldMix, 0.0, 1.0);
  if (t <= 0.0) return meshLuminance(posPx / dims * 100.0, u_time);
  if (t >= 1.0) return burstLuminance(posPx, centerPx, burstRadiusPx);

  return mix(
    meshLuminance(posPx / dims * 100.0, u_time),
    burstLuminance(posPx, centerPx, burstRadiusPx),
    t
  );
}

// Union of every live trail sample's influence at this fragment. Evaluated once per
// fragment, deliberately outside the dot search — a TRAIL_N loop nested inside that
// search would multiply out to thousands of iterations per pixel.
float cursorTrailInfluence (vec2 posPx, vec2 dims, float radiusPx) {
  if (u_cursorUv.x < 0.0) return 0.0;

  float best = 0.0;

  for (int i = 0; i < TRAIL_N; i++) {
    // NB: "sample" is a reserved word in GLSL ES 3.00, so this cannot be named that.
    vec4 node = u_trail[i];
    // getCursorUniforms packs live samples from index 0 and zero-fills the tail, so the
    // first empty slot means every later one is empty too.
    if (node.z <= 0.0) break;

    float d = distance(posPx, node.xy * dims);
    float shoulder = 1.0 - smoothstep(0.0, max(radiusPx, 1.0), d);
    // Samples further away than the radius contribute nothing, and pow is two SFU ops —
    // not worth spending on a base of zero.
    if (shoulder <= 0.0) continue;

    // The exponent softens the shoulder so the streak's edge dissolves instead of ending
    // on a defined rim.
    best = max(best, pow(shoulder, 1.7) * node.z);
  }

  return best * u_cursorStrength;
}

// Blends toward the luminance the cursor is carrying in from where it just was. Clamped
// because u_cursorStrength may exceed 1 to let the effect overshoot.
float applyCursorCarry (float lum, float influence, float carryLum) {
  if (influence <= 0.0) return lum;

  return clamp(mix(lum, carryLum, influence), 0.0, 1.0);
}

void main () {
  highp vec2 dims = vec2(max(u_resolution, vec2(1.0)));
  highp vec2 px = gl_FragCoord.xy;
  px.y = dims.y - px.y; // Top-left origin, y-down, to match the CSS coordinate space.

  highp vec2 centerPx = u_center / 100.0 * dims;

  // Burst radius drifts by +/- u_breatheAmount over a seamless loop (sin returns to
  // baseline at t=0, so there is no jump on wrap).
  float breathe = 1.0 + u_breatheAmount * sin(2.0 * PI * u_time / max(u_breathePeriod, 0.0001));
  float burstRadiusPx = u_burstRadiusFrac * max(u_burstScale, 0.0001) * dims.y * breathe;

  // u_resolution and gl_FragCoord are in backing-buffer pixels, and u_pixelRatio is the
  // backing-to-CSS scale Paper actually rendered at (its own clamped value, which is not
  // devicePixelRatio and may fall below 1). Scaling here keeps dot geometry constant in
  // CSS pixels across displays.
  float dotSpacing = max(u_dotSpacingCss * u_pixelRatio, 1.0);
  float maxDotSize = u_maxDotSizeCss * u_pixelRatio;

  vec2 cursorPrevPx = u_cursorPrevUv * dims;
  float cursorRadiusPx = u_cursorRadiusFrac * dims.y;
  // Order matters: applyCursorCarry ignores carryLum entirely when influence is zero, so
  // evaluating the field a second time for it is wasted work. That is the common case —
  // every touch device, reduced motion, and any moment before the first pointer move —
  // and there the branch is uniform across the draw, so it costs nothing.
  float cursorInfluence = cursorTrailInfluence(px, dims, cursorRadiusPx);
  float carryLum = cursorInfluence > 0.0
    ? fieldLuminance(cursorPrevPx, dims, centerPx, burstRadiusPx)
    : 0.0;

  highp vec2 rel = px - centerPx;
  highp float dist = length(rel);

  // Phyllotaxis placement: dot i sits at angle i * goldenAngle, radius sqrt(i) * scale.
  // Inverting radius gives an analytic index estimate, so the nearest dot is found by
  // searching a fixed window around it rather than the whole lattice.
  highp float goldenAngle = 2.39996323; // ~137.508 degrees
  highp float scaleFactor = dotSpacing / sqrt(PI);
  highp float scaleFactorSq = max(scaleFactor * scaleFactor, 0.0001);
  highp int iApprox = int(dist * dist / scaleFactorSq);

  // Squared distances throughout: the comparison is monotonic, so the one sqrt is
  // deferred until after the search.
  highp float closestDotDistSq = 1e9;
  highp vec2 closestDotPx = centerPx;

  for (int ii = 0; ii < 301; ii++) {
    highp int i = max(0, iApprox - 150 + ii);
    highp float dotAngle = float(i) * goldenAngle;
    highp float dotR = sqrt(float(i)) * scaleFactor;
    highp vec2 dotPx = centerPx + dotR * vec2(cos(dotAngle), sin(dotAngle));
    highp vec2 dotOff = px - dotPx;
    highp float dSq = dot(dotOff, dotOff);

    if (dSq < closestDotDistSq) {
      closestDotDistSq = dSq;
      closestDotPx = dotPx;
    }
  }

  float closestDotDist = sqrt(closestDotDistSq);

  // Luminance is evaluated once, for the winning dot only. Sampling inside the loop would
  // re-run it on every improvement to the running minimum and discard all but the last.
  float lum = fieldLuminance(closestDotPx, dims, centerPx, burstRadiusPx);
  lum = applyCursorCarry(lum, cursorInfluence, carryLum);
  float closestDotRadius = min(maxDotSize * computeSizeFactor(lum, u_sizeVariation), dotSpacing * 0.45);

  float feather = min(0.5, closestDotRadius * 0.3);
  float coverage = 1.0 - smoothstep(closestDotRadius - feather, closestDotRadius + feather, closestDotDist);

  // Empties the far corners by fading dot visibility (not dot size) once the fragment
  // itself sits past the burst's reach. Mixed rather than applied outright: at 0 the field
  // carries its floor luminance all the way into the corners, which is how the reference
  // looks before any scroll has happened.
  float fragRadialFrac = dist / max(burstRadiusPx, 0.0001);
  float burstEdgeFade = 1.0 - smoothstep(0.5, 1.35, fragRadialFrac);
  coverage *= mix(1.0, burstEdgeFade, clamp(u_edgeFadeAmount, 0.0, 1.0));

  fragColor = vec4(mix(u_bgColor.rgb, u_dotColor.rgb, coverage), 1.0);
}
`;
