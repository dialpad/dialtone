/** Vertex shader: size each precomputed point from the animated luminance field. */
export const halftonePointVertexShader = /* glsl */ `#version 300 es
precision highp float;

in vec2 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_time;
uniform float u_dotSpacingCss;
uniform float u_maxDotSizeCss;
uniform vec2 u_center;
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
uniform vec4 u_meshDark1;
uniform vec4 u_meshDark2;
uniform vec4 u_meshLight1;
uniform vec4 u_meshLight2;
uniform float u_meshPointSize;
uniform float u_meshSmoothness;
uniform float u_maxPointSizePx;

flat out float v_radiusPx;
flat out float v_featherPx;
flat out float v_opacity;
flat out float v_pointSizePx;

#define PI 3.14159265359

float computeSizeFactor (float lum, float sizeVariation) {
  if (sizeVariation <= 1.0) {
    return max(0.0, mix(1.0, 1.0 - lum, sizeVariation));
  }

  return max(0.0, mix(1.0 - lum, lum, sizeVariation - 1.0));
}

float burstLuminance (vec2 p, vec2 centerPx, float burstRadiusPx) {
  float radialFrac = length(p - centerPx) / max(burstRadiusPx, 0.0001);
  float floorLum = clamp(u_floorLuminance, 0.0, 1.0);
  float peak = 0.275 * u_coreScale;
  float inner = smoothstep(peak * 0.5, peak, radialFrac);
  float outer = 1.0 - smoothstep(peak, 1.0, radialFrac);
  float bump = clamp(min(inner, outer), 0.0, 1.0);

  return floorLum + (1.0 - floorLum) * bump;
}

float meshLuminance (vec2 uvPct, float time) {
  float period = max(u_meshPeriod, 0.0001);
  float halfPeriod = period * 0.5;
  float loopTime = mod(time, period);
  float segment = loopTime < halfPeriod
    ? smoothstep(0.0, 1.0, loopTime / halfPeriod)
    : 1.0 - smoothstep(0.0, 1.0, (loopTime - halfPeriod) / halfPeriod);

  vec2 dark1 = mix(u_meshDark1.xy, u_meshDark1.zw, segment);
  vec2 dark2 = mix(u_meshDark2.xy, u_meshDark2.zw, segment);
  vec2 light1 = mix(u_meshLight1.xy, u_meshLight1.zw, segment);
  vec2 light2 = mix(u_meshLight2.xy, u_meshLight2.zw, segment);
  float pointSize = max(u_meshPointSize, 0.0001);
  float smoothness = max(u_meshSmoothness, 0.0001);
  vec2 uv = (uvPct - 50.0) / 100.0;
  float d1 = max(distance(uv, (dark1 - 50.0) / 100.0) / pointSize, 0.02);
  float d2 = max(distance(uv, (dark2 - 50.0) / 100.0) / pointSize, 0.02);
  float d3 = max(distance(uv, (light1 - 50.0) / 100.0) / pointSize, 0.02);
  float d4 = max(distance(uv, (light2 - 50.0) / 100.0) / pointSize, 0.02);
  float w1 = 1.0 / pow(d1, smoothness);
  float w2 = 1.0 / pow(d2, smoothness);
  float w3 = 1.0 / pow(d3, smoothness);
  float w4 = 1.0 / pow(d4, smoothness);

  return (w3 + w4) / max(w1 + w2 + w3 + w4, 0.0001);
}

float fieldLuminance (vec2 position, vec2 centerPx, float burstRadiusPx) {
  float mixAmount = clamp(u_fieldMix, 0.0, 1.0);
  if (mixAmount <= 0.0) return meshLuminance(position / u_resolution * 100.0, u_time);
  if (mixAmount >= 1.0) return burstLuminance(position, centerPx, burstRadiusPx);

  return mix(
    meshLuminance(position / u_resolution * 100.0, u_time),
    burstLuminance(position, centerPx, burstRadiusPx),
    mixAmount
  );
}

void main () {
  vec2 resolution = max(u_resolution, vec2(1.0));
  vec2 centerPx = u_center / 100.0 * resolution;
  float breathe = 1.0 + u_breatheAmount * sin(
    2.0 * PI * u_time / max(u_breathePeriod, 0.0001)
  );
  float burstRadiusPx = u_burstRadiusFrac * max(u_burstScale, 0.0001) *
    resolution.y * breathe;
  float luminance = fieldLuminance(a_position, centerPx, burstRadiusPx);
  float radiusCss = min(
    u_maxDotSizeCss * computeSizeFactor(luminance, u_sizeVariation),
    u_dotSpacingCss * 0.45
  );
  float radiusPx = radiusCss * u_pixelRatio;
  float featherPx = min(0.5, radiusPx * 0.3);
  float radialFrac = distance(a_position, centerPx) / max(burstRadiusPx, 0.0001);
  float edgeFade = 1.0 - smoothstep(0.5, 1.35, radialFrac);

  v_radiusPx = radiusPx;
  v_featherPx = featherPx;
  v_opacity = mix(1.0, edgeFade, clamp(u_edgeFadeAmount, 0.0, 1.0));
  v_pointSizePx = min(max(2.0 * (radiusPx + featherPx), 1.0), u_maxPointSizePx);
  gl_PointSize = v_pointSizePx;
  gl_Position = vec4(
    a_position.x / resolution.x * 2.0 - 1.0,
    1.0 - a_position.y / resolution.y * 2.0,
    0.0,
    1.0
  );
}
`;

/** Fragment shader: turn each rasterized point square into an antialiased circle. */
export const halftonePointFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform vec4 u_dotColor;

flat in float v_radiusPx;
flat in float v_featherPx;
flat in float v_opacity;
flat in float v_pointSizePx;

out vec4 fragColor;

void main () {
  vec2 pointPx = (gl_PointCoord - 0.5) * v_pointSizePx;
  float distanceFromCenter = length(pointPx);
  float coverage = 1.0 - smoothstep(
    max(v_radiusPx - v_featherPx, 0.0),
    v_radiusPx + v_featherPx,
    distanceFromCenter
  );

  fragColor = vec4(u_dotColor.rgb, u_dotColor.a * coverage * v_opacity);
}
`;
