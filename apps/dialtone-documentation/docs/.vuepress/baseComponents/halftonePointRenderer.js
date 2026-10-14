/**
 * WebGL point-sprite renderer for the homepage halftone.
 *
 * The previous fragment shader found the nearest phyllotaxis point independently for
 * every canvas pixel by searching 301 candidates. This renderer computes the point
 * centres once per resize and asks the GPU to rasterize only those points. Animation
 * therefore scales with the number of dots instead of canvas pixels times 301.
 *
 * @module baseComponents/halftonePointRenderer
 */

import {
  halftonePointFragmentShader,
  halftonePointVertexShader,
} from './halftonePointShaders.js';

/** Geometry defaults shared by the hero and footer surfaces. */
export const HERO_GEOMETRY = Object.freeze({
  dotSpacingCss: 20,
  maxDotSizeCss: 4,
  center: Object.freeze([50, 104]),
  burstRadiusFrac: 1.07,
  burstScale: 1,
  coreScale: 1,
  breatheAmount: 0.065,
  breathePeriod: 10,
  fieldMix: 0,
  meshPeriod: 7,
  meshDarkPoles: Object.freeze([
    Object.freeze([-10, 20, 2, 100]),
    Object.freeze([64, 6, 38, 72]),
  ]),
  meshLightPoles: Object.freeze([
    Object.freeze([14, 108, 44, 90]),
    Object.freeze([94, 100, 62, 114]),
  ]),
  meshPointSize: 5.5,
  meshSmoothness: 5,
  sizeVariation: 2,
  edgeFadeAmount: 0,
  floorLuminance: 0.06,
});

const GEOMETRY_UNIFORMS = new Set([
  'u_center',
  'u_dotSpacingCss',
  'u_maxDotSizeCss',
]);

const createShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
};

const createProgram = (gl) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, halftonePointVertexShader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, halftonePointFragmentShader);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || 'Unknown shader linking error.';
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
};

const farthestCornerDistance = (width, height, centerX, centerY) => Math.max(
  Math.hypot(centerX, centerY),
  Math.hypot(width - centerX, centerY),
  Math.hypot(centerX, height - centerY),
  Math.hypot(width - centerX, height - centerY),
);

/**
 * Generates the phyllotaxis centres once, in CSS pixels with a top-left origin.
 *
 * @param {number} width
 * @param {number} height
 * @param {Record<string, number | number[]>} uniforms
 * @returns {Float32Array}
 */
export const buildHalftonePoints = (width, height, uniforms) => {
  const spacing = Math.max(uniforms.u_dotSpacingCss, 1);
  const maxRadius = Math.max(uniforms.u_maxDotSizeCss, 0);
  const centerX = uniforms.u_center[0] / 100 * width;
  const centerY = uniforms.u_center[1] / 100 * height;
  const scale = spacing / Math.sqrt(Math.PI);
  const maxDistance = farthestCornerDistance(width, height, centerX, centerY) + maxRadius;
  const pointCount = Math.ceil((maxDistance * maxDistance) / (scale * scale)) + 1;
  const points = new Float32Array(pointCount * 2);
  const goldenAngle = 2.39996323;
  let visiblePointCount = 0;

  for (let index = 0; index < pointCount; index += 1) {
    const angle = index * goldenAngle;
    const radius = Math.sqrt(index) * scale;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // WebGL clips a point from its centre, so uploading off-canvas centres cannot affect
    // the image. Removing them cuts the hero buffer from roughly 12k to roughly 3.5k dots.
    if (x < 0 || x > width || y < 0 || y > height) continue;

    points[visiblePointCount * 2] = x;
    points[visiblePointCount * 2 + 1] = y;
    visiblePointCount += 1;
  }

  return points.slice(0, visiblePointCount * 2);
};

const uniformNames = [
  'u_resolution',
  'u_pixelRatio',
  'u_time',
  'u_dotSpacingCss',
  'u_maxDotSizeCss',
  'u_center',
  'u_dotColor',
  'u_sizeVariation',
  'u_burstRadiusFrac',
  'u_burstScale',
  'u_coreScale',
  'u_breatheAmount',
  'u_breathePeriod',
  'u_edgeFadeAmount',
  'u_floorLuminance',
  'u_fieldMix',
  'u_meshPeriod',
  'u_meshDark1',
  'u_meshDark2',
  'u_meshLight1',
  'u_meshLight2',
  'u_meshPointSize',
  'u_meshSmoothness',
  'u_maxPointSizePx',
];

/** Lightweight ShaderMount-compatible API backed by WebGL point sprites. */
export class HalftonePointRenderer {
  constructor (host, uniforms, options = {}) {
    this.host = host;
    this.uniforms = { ...uniforms };
    this.minPixelRatio = options.minPixelRatio ?? 1;
    this.maxPixelCount = options.maxPixelCount ?? Number.POSITIVE_INFINITY;
    this.canvasElement = document.createElement('canvas');
    this.gl = this.canvasElement.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });

    if (!this.gl) throw new Error('WebGL 2 is unavailable.');

    this.program = createProgram(this.gl);
    this.buffer = this.gl.createBuffer();
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.maxPointSize = this.gl.getParameter(this.gl.ALIASED_POINT_SIZE_RANGE)[1];
    this.uniformLocations = Object.fromEntries(uniformNames.map((name) => [
      name,
      this.gl.getUniformLocation(this.program, name),
    ]));
    this.pointCount = 0;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 1;
    this.elapsedSeconds = 0;
    this.speed = 0;
    this.animationFrame = 0;
    this.renderFrame = 0;
    this.lastFrameTime = 0;
    this.isDisposed = false;

    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => this.resize());
    this.resizeObserver?.observe(host);
    host.appendChild(this.canvasElement);
    this.resize();
    this.setSpeed(options.speed ?? 0);
  }

  getPixelRatio (width, height) {
    const preferred = Math.max(window.devicePixelRatio || 1, this.minPixelRatio);
    const capped = Math.sqrt(this.maxPixelCount / Math.max(width * height, 1));

    return Math.max(Math.min(preferred, capped), 0.1);
  }

  resize () {
    if (this.isDisposed) return;

    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    if (width === 0 || height === 0) return;

    const pixelRatio = this.getPixelRatio(width, height);
    const canvasWidth = Math.max(Math.round(width * pixelRatio), 1);
    const canvasHeight = Math.max(Math.round(height * pixelRatio), 1);

    if (
      width === this.width &&
      height === this.height &&
      canvasWidth === this.canvasElement.width &&
      canvasHeight === this.canvasElement.height
    ) return;

    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
    this.canvasElement.width = canvasWidth;
    this.canvasElement.height = canvasHeight;
    this.gl.viewport(0, 0, canvasWidth, canvasHeight);
    this.rebuildPoints();
    this.requestRender();
  }

  rebuildPoints () {
    const points = buildHalftonePoints(this.width, this.height, this.uniforms);
    this.pointCount = points.length / 2;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);
  }

  setUniforms (next) {
    const rebuild = Object.keys(next).some((name) => GEOMETRY_UNIFORMS.has(name));
    Object.assign(this.uniforms, next);

    if (rebuild && this.width > 0 && this.height > 0) this.rebuildPoints();
    if (this.speed === 0) this.requestRender();
  }

  setSpeed (speed) {
    const nextSpeed = Math.max(speed, 0);
    if (nextSpeed === this.speed && (nextSpeed === 0 || this.animationFrame !== 0)) return;

    this.speed = nextSpeed;
    this.lastFrameTime = 0;

    if (this.speed === 0) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
      this.requestRender();
    } else {
      cancelAnimationFrame(this.renderFrame);
      this.renderFrame = 0;
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    }
  }

  animate (time) {
    if (this.isDisposed || this.speed === 0) return;

    if (this.lastFrameTime !== 0) {
      this.elapsedSeconds += (time - this.lastFrameTime) / 1000 * this.speed;
    }
    this.lastFrameTime = time;
    this.render();
    this.animationFrame = requestAnimationFrame((nextTime) => this.animate(nextTime));
  }

  requestRender () {
    if (this.isDisposed || this.animationFrame !== 0 || this.renderFrame !== 0) return;

    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = 0;
      this.render();
    });
  }

  setShaderUniforms () {
    const gl = this.gl;
    const location = this.uniformLocations;
    const uniforms = this.uniforms;

    gl.uniform2f(location.u_resolution, this.width, this.height);
    gl.uniform1f(location.u_pixelRatio, this.pixelRatio);
    gl.uniform1f(location.u_time, this.elapsedSeconds);
    gl.uniform1f(location.u_dotSpacingCss, uniforms.u_dotSpacingCss);
    gl.uniform1f(location.u_maxDotSizeCss, uniforms.u_maxDotSizeCss);
    gl.uniform2fv(location.u_center, uniforms.u_center);
    gl.uniform4fv(location.u_dotColor, uniforms.u_dotColor);
    gl.uniform1f(location.u_sizeVariation, uniforms.u_sizeVariation);
    gl.uniform1f(location.u_burstRadiusFrac, uniforms.u_burstRadiusFrac);
    gl.uniform1f(location.u_burstScale, uniforms.u_burstScale);
    gl.uniform1f(location.u_coreScale, uniforms.u_coreScale);
    gl.uniform1f(location.u_breatheAmount, uniforms.u_breatheAmount);
    gl.uniform1f(location.u_breathePeriod, uniforms.u_breathePeriod);
    gl.uniform1f(location.u_edgeFadeAmount, uniforms.u_edgeFadeAmount);
    gl.uniform1f(location.u_floorLuminance, uniforms.u_floorLuminance);
    gl.uniform1f(location.u_fieldMix, uniforms.u_fieldMix);
    gl.uniform1f(location.u_meshPeriod, uniforms.u_meshPeriod);
    gl.uniform4fv(location.u_meshDark1, uniforms.u_meshDark1);
    gl.uniform4fv(location.u_meshDark2, uniforms.u_meshDark2);
    gl.uniform4fv(location.u_meshLight1, uniforms.u_meshLight1);
    gl.uniform4fv(location.u_meshLight2, uniforms.u_meshLight2);
    gl.uniform1f(location.u_meshPointSize, uniforms.u_meshPointSize);
    gl.uniform1f(location.u_meshSmoothness, uniforms.u_meshSmoothness);
    gl.uniform1f(location.u_maxPointSizePx, this.maxPointSize);
  }

  render () {
    if (this.isDisposed || this.pointCount === 0) return;

    const gl = this.gl;
    const background = this.uniforms.u_bgColor;

    gl.clearColor(background[0], background[1], background[2], background[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);
    this.setShaderUniforms();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.drawArrays(gl.POINTS, 0, this.pointCount);
  }

  dispose () {
    if (this.isDisposed) return;
    this.isDisposed = true;
    cancelAnimationFrame(this.animationFrame);
    cancelAnimationFrame(this.renderFrame);
    this.resizeObserver?.disconnect();
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
    this.canvasElement.remove();
  }
}
