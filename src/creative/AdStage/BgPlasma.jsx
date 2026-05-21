import { useEffect, useRef } from "react";

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// fBm noise plasma in Aladdin's world palette:
// deep earth → olive green → rust orange → dusty yellow
const FRAG = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_res;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = p * 2.1 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.05;
    vec2 p   = uv * 3.0;

    // Domain-warped fBm: three layers of warping give organic flow
    float n0 = fbm(p + t);
    float n1 = fbm(p + vec2(n0, n0) * 1.6 + vec2(t * 0.8, t * 0.3));
    float f  = fbm(p + vec2(n1, n1) * 1.6 - vec2(t * 0.35, t * 0.55));

    // Aladdin poster palette: indigo night → purple → blue → peach accent
    vec3 c0 = vec3(0.04, 0.02, 0.10); // deep indigo-black
    vec3 c1 = vec3(0.40, 0.20, 0.75); // rich violet-purple (most dominant)
    vec3 c2 = vec3(0.10, 0.30, 0.80); // poster sky blue (mid)
    vec3 c3 = vec3(0.96, 0.97, 1.00); // near-white cloud highlight (least)

    vec3 col = mix(c0, c1, smoothstep(0.00, 0.35, f));
    col      = mix(col, c2, smoothstep(0.30, 0.62, f));
    col      = mix(col, c3, smoothstep(0.58, 0.88, f));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function BgPlasma() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    gl.uniform2f(uRes, canvas.width, canvas.height);

    const start = performance.now();
    let raf;

    function render() {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return <canvas ref={ref} width={480} height={375} className="ad-stage__bg" />;
}
