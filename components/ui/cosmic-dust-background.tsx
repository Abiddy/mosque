import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];
/** Shadow, mid, cloud, highlight — darkest to brightest. */
export type DustPalette = [RGB, RGB, RGB, RGB];

export const BLUE_PALETTE: DustPalette = [
  [0.02, 0.05, 0.13],
  [0.06, 0.13, 0.3],
  [0.11, 0.26, 0.56],
  [0.24, 0.48, 0.88],
];

/** Top-to-bottom journey used when the background follows page scroll. */
export const SCROLL_PALETTES: DustPalette[] = [
  BLUE_PALETTE,
  [
    [0.04, 0.09, 0.2],
    [0.1, 0.2, 0.4],
    [0.18, 0.36, 0.66],
    [0.34, 0.58, 0.92],
  ],
  [
    [0.02, 0.1, 0.14],
    [0.06, 0.22, 0.3],
    [0.1, 0.4, 0.46],
    [0.22, 0.62, 0.62],
  ],
  [
    [0.02, 0.09, 0.06],
    [0.05, 0.2, 0.13],
    [0.1, 0.36, 0.24],
    [0.22, 0.56, 0.38],
  ],
  [
    [0.01, 0.04, 0.03],
    [0.03, 0.11, 0.07],
    [0.06, 0.22, 0.14],
    [0.14, 0.38, 0.25],
  ],
];

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scale;
uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_resolution;
  vec2 p = (frag - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  p *= 1.6;

  float t = u_time * 0.035;

  vec2 q = vec2(
    fbm(p + t),
    fbm(p + vec2(5.2, 1.3) - t * 0.8)
  );
  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 1.1)
  );
  float f = fbm(p + 2.6 * r);

  float cloud = smoothstep(0.28, 0.95, f);
  float veins = smoothstep(0.55, 0.9, fbm(p * 1.8 + 3.5 * r + 12.0));

  vec3 gold = vec3(0.83, 0.62, 0.26);
  vec3 goldLight = vec3(1.0, 0.84, 0.50);

  vec3 col = mix(u_c0, u_c1, smoothstep(0.1, 0.45, f));
  col = mix(col, u_c2, cloud);
  col = mix(col, u_c3, cloud * smoothstep(0.45, 0.85, r.x) * 0.75);
  float goldMask = veins * cloud * smoothstep(0.4, 0.8, q.y);
  col = mix(col, gold, goldMask * 0.85);
  col += goldLight * pow(goldMask, 3.0) * 0.35;

  vec2 drift = vec2(u_time * 6.0, u_time * 2.5) * u_scale;
  vec2 cell = floor((frag + drift) / max(u_scale, 1.0));
  float speck = hash(cell);
  float sparkle = 0.6 + 0.4 * sin(u_time * 1.5 + speck * 40.0);
  float dustAmount = cloud * 0.9 + 0.08;
  float dust = step(0.965, speck) * dustAmount * sparkle;
  vec3 dustTint = mix(u_c3, vec3(1.0), 0.45);
  vec3 dustColor = mix(dustTint, goldLight, step(0.5, fract(speck * 91.7)) * (0.35 + goldMask));
  col += dustColor * dust * 0.55;

  float fine = hash(frag + fract(u_time) * 17.0) - 0.5;
  col += fine * 0.025;

  float vignette = smoothstep(1.25, 0.25, length((uv - vec2(0.5, 0.55)) * vec2(1.1, 1.3)));
  col *= mix(0.6, 1.0, vignette);
  col *= mix(0.75, 1.0, smoothstep(0.0, 0.4, uv.y));

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function paletteAt(palettes: DustPalette[], progress: number): DustPalette {
  if (palettes.length === 1) return palettes[0];
  const x = Math.min(Math.max(progress, 0), 1) * (palettes.length - 1);
  const i = Math.min(Math.floor(x), palettes.length - 2);
  const k = x - i;
  const a = palettes[i];
  const b = palettes[i + 1];
  return a.map((c, ci) =>
    c.map((v, vi) => v + (b[ci][vi] - v) * k)
  ) as DustPalette;
}

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

type CosmicDustBackgroundProps = {
  className?: string;
  /** Frames per second cap; the effect is slow-moving so 30 is plenty. */
  fps?: number;
  /** Pin to the viewport and blend through `SCROLL_PALETTES` as the page scrolls. */
  followScroll?: boolean;
};

export function CosmicDustBackground({
  className,
  fps = 30,
  followScroll = false,
}: CosmicDustBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uScale = gl.getUniformLocation(program, "u_scale");
    const uColors = [0, 1, 2, 3].map((i) =>
      gl.getUniformLocation(program, `u_c${i}`)
    );

    const palettes = followScroll ? SCROLL_PALETTES : [BLUE_PALETTE];
    let target = followScroll ? scrollProgress() : 0;
    let current = target;

    const applyPalette = () => {
      paletteAt(palettes, current).forEach((c, i) =>
        gl.uniform3f(uColors[i], c[0], c[1], c[2])
      );
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
      gl.uniform1f(uScale, dpr);
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const start = performance.now();
    const frameInterval = 1000 / fps;
    let last = 0;
    let raf = 0;
    let visible = true;

    const draw = (now: number) => {
      current += (target - current) * 0.08;
      applyPalette();
      gl.uniform1f(uTime, (now - start) / 1000 + 20);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < frameInterval) return;
      last = now;
      draw(now);
    };

    const play = () => {
      if (reducedMotion || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    applyPalette();
    draw(performance.now());
    play();

    const onScroll = () => {
      target = scrollProgress();
      if (reducedMotion) {
        current = target;
        draw(performance.now());
      }
    };
    if (followScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    intersectionObserver.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [fps, followScroll]);

  return (
    <div
      aria-hidden
      className={cn(
        followScroll ? "fixed inset-0 z-0" : "absolute inset-0",
        "overflow-hidden bg-[radial-gradient(ellipse_at_40%_45%,#1d4290_0%,#0f2350_45%,#060e24_100%)]",
        className
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default CosmicDustBackground;
