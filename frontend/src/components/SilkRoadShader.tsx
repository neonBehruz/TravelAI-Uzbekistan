import React, { useEffect, useRef } from 'react';

export const SilkRoadShader: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gl.viewport(0, 0, width, height);
    };

    window.addEventListener('resize', handleResize);

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Authentic Silk Road & Uzbekistan Smart Travel GLSL Shader
    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_uv;

      // Authentic Uzbekistan Silk Road Palette
      #define COLOR_NIGHT_SKY    vec3(0.015, 0.035, 0.09)  // Deep Timurid Midnight #040917
      #define COLOR_SAMARKAND    vec3(0.0, 0.85, 0.78)     // Vibrant Turquoise #00D9C7
      #define COLOR_AZURE        vec3(0.05, 0.55, 0.95)    // Lapis Lazuli Azure #0D8CF2
      #define COLOR_BUKHARA_GOLD vec3(0.96, 0.72, 0.22)    // Imperial Gold #F5B838
      #define COLOR_AMBER_DUNE   vec3(0.85, 0.48, 0.12)    // Desert Dune Amber #D97A1E
      #define COLOR_EMERALD      vec3(0.04, 0.78, 0.52)    // Oasis Emerald #0AC785

      mat2 rotate2D(float angle) {
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
      }

      // 8-Pointed Islamic Girih Star (Rub el Hizb)
      float sdStar8(vec2 p, float r) {
        p = abs(p);
        vec2 p45 = rotate2D(0.785398) * p;
        float d1 = max(p.x, p.y);
        float d2 = max(p45.x, p45.y);
        return min(d1, d2) - r;
      }

      // Procedural Girih sacred geometry lattice pattern
      float girihPattern(vec2 p, float scale) {
        vec2 grid = fract(p * scale) - 0.5;
        grid = rotate2D(u_time * 0.04) * grid;
        float star = abs(sdStar8(grid, 0.24)) - 0.012;
        float ring = abs(length(grid) - 0.36) - 0.010;
        return max(0.0, 0.025 / (min(star, ring) + 0.03));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = uv;
        p.x *= aspect;

        vec2 mouseNorm = u_mouse / u_resolution;
        mouseNorm.x *= aspect;
        float mouseDist = length(p - mouseNorm);
        float mouseGlow = smoothstep(0.45, 0.0, mouseDist);

        float t = u_time * 0.35;

        // 1. Base Gradient: Deep Central Asian Night Sky
        vec3 col = mix(COLOR_NIGHT_SKY, vec3(0.03, 0.09, 0.22), uv.y * 0.9);

        // 2. Sacred Girih Islamic Star Constellation Lattice (Night Sky layer)
        vec2 girihPos = p * 1.5 + vec2(t * 0.05, t * 0.02);
        float girih = girihPattern(girihPos, 2.5);
        col += COLOR_AZURE * girih * 0.18 * (uv.y * 0.8 + 0.2);
        col += COLOR_BUKHARA_GOLD * girih * 0.12 * (1.0 - uv.y * 0.5);

        // 3. Flowing Silk Road Turquoise Ribbon Waves (Ancient trade routes)
        float wave1 = sin(p.x * 1.8 + t * 0.8) * 0.12 + sin(p.x * 3.4 - t * 0.5) * 0.06;
        float line1 = abs(uv.y - (0.52 + wave1));
        float ribbonTurquoise = 0.035 / (line1 + 0.045);

        float wave2 = cos(p.x * 2.2 - t * 0.6) * 0.14 + sin(p.x * 4.2 + t * 0.7) * 0.05;
        float line2 = abs(uv.y - (0.42 + wave2));
        float ribbonAzure = 0.04 / (line2 + 0.05);

        float wave3 = sin(p.x * 2.8 + t * 0.9 + 2.0) * 0.10 + cos(p.x * 5.0 - t * 0.4) * 0.04;
        float line3 = abs(uv.y - (0.32 + wave3));
        float ribbonGold = 0.03 / (line3 + 0.05);

        col += COLOR_SAMARKAND * ribbonTurquoise * 0.95;
        col += COLOR_AZURE * ribbonAzure * 0.85;
        col += COLOR_BUKHARA_GOLD * ribbonGold * 0.75;
        col += COLOR_EMERALD * (ribbonTurquoise * ribbonAzure) * 0.4;

        // 4. Silk Road Desert Dunes at the horizon (Warm amber sand ripples)
        float dune1Y = 0.20 + sin(p.x * 1.4 + t * 0.2) * 0.07 + sin(p.x * 3.1) * 0.03;
        float duneMask1 = smoothstep(dune1Y + 0.03, dune1Y - 0.01, uv.y);
        vec3 duneCol1 = mix(COLOR_AMBER_DUNE * 0.4, COLOR_BUKHARA_GOLD * 0.35, (uv.y / 0.25));
        col = mix(col, col + duneCol1, duneMask1 * 0.6);

        float dune2Y = 0.12 + sin(p.x * 2.0 - t * 0.15 + 1.0) * 0.05 + cos(p.x * 4.5) * 0.02;
        float duneMask2 = smoothstep(dune2Y + 0.02, dune2Y - 0.01, uv.y);
        vec3 duneCol2 = mix(COLOR_AMBER_DUNE * 0.6, COLOR_BUKHARA_GOLD * 0.55, (uv.y / 0.15));
        col = mix(col, col + duneCol2, duneMask2 * 0.8);

        // 5. Constellation Waypoints (Samarkand, Bukhara, Khiva, Tashkent navigation beacons)
        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          vec2 nodePos = vec2(
            fract(sin(fi * 78.233) * 43758.5453) * aspect * 1.2 - aspect * 0.1,
            0.35 + fract(cos(fi * 12.871) * 23421.631) * 0.45
          );
          float nodeDist = length(p - nodePos);
          float pulse = sin(u_time * 2.5 + fi * 1.5) * 0.5 + 0.5;
          float nodeGlow = 0.015 / (nodeDist + 0.035) * (0.6 + pulse * 0.4);
          col += (fi < 3.0 ? COLOR_SAMARKAND : COLOR_BUKHARA_GOLD) * nodeGlow * 0.45;
        }

        // 6. Interactive Caravan Stardust under cursor
        col += (COLOR_SAMARKAND * 0.6 + COLOR_BUKHARA_GOLD * 0.4) * mouseGlow * 0.5;

        // 7. Twinkling Silk Road Desert Stars
        vec2 starGrid = fract(p * 24.0);
        float starDist = length(starGrid - 0.5);
        float starBlink = sin(p.x * 60.0 + p.y * 40.0 + u_time * 3.0) * 0.5 + 0.5;
        float starMask = smoothstep(0.08, 0.0, starDist) * starBlink * (uv.y * 0.7);
        col += vec3(starMask * 0.45);

        // 8. Soft Vignette for majestic depth
        float vignette = smoothstep(1.5, 0.35, length(uv - 0.5));
        col *= (vignette * 0.85 + 0.15);

        gl_FragColor = vec4(col, 0.95);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn('Shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad geometry buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouseX = width * 0.5;
    let mouseY = height * 0.5;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = window.innerHeight - e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      gl.viewport(0, 0, width, height);
      gl.uniform1f(uTime, currentTime);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style
      }}
    />
  );
};
