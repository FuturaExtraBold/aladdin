import { useEffect, useRef } from "react";

const STAR_COUNT = 300;

const VERT = `
  attribute vec3 a_star; // x, y, seed
  uniform float u_time;
  varying float v_brightness;
  varying float v_size;

  void main() {
    float speed  = 0.3 + fract(a_star.z * 7.13) * 0.7;
    v_brightness = 0.2 + 0.8 * abs(sin(u_time * speed * 1.8 + a_star.z * 6.28));
    v_size       = 4.0 + fract(a_star.z * 3.77) * 3.0;
    gl_PointSize = v_size;
    gl_Position  = vec4(a_star.x, a_star.y, 0.0, 1.0);
  }
`;

const FRAG = `
  precision highp float;
  varying float v_brightness;

  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float d = length(coord);
    // 1px anti-aliased edge — crisp but not a box
    float alpha = (1.0 - smoothstep(0.38, 0.50, d)) * v_brightness;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

// Seeded pseudo-random — deterministic so stars don't jump on re-render
function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

function buildStars(count) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = seededRandom(i * 3);
    const r2 = seededRandom(i * 3 + 1);
    const r3 = seededRandom(i * 3 + 2);
    data[i * 3] = r * 2.0 - 1.0; // x: full width in clip space
    data[i * 3 + 1] = r2 * 0.6 + 0.4; // y: upper 30–100% of canvas
    data[i * 3 + 2] = r3 * 100.0; // seed for twinkle phase
  }
  return data;
}

export default function StarField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 1200;
    const cssH = canvas.clientHeight || 300;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // standard alpha blend, no blow-out

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const stars = buildStars(STAR_COUNT);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, stars, gl.STATIC_DRAW);

    const aStar = gl.getAttribLocation(prog, "a_star");
    gl.enableVertexAttribArray(aStar);
    gl.vertexAttribPointer(aStar, 3, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");

    const start = performance.now();
    let raf;

    function render() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.POINTS, 0, STAR_COUNT);
      raf = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={1200}
      height={300}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "40vh",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
