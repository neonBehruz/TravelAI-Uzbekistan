import React, { useEffect, useRef } from 'react';

export const SilkRoadShader: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      // Fallback for non-WebGL
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
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

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_uv;

      // Simplex-inspired 2D noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse / u_resolution;
        float distToMouse = length(v_uv - mouse);

        float t = u_time * 0.25;

        // Silk Road fluid aurora waves
        float n1 = snoise(st * 1.8 + vec2(t * 0.4, t * 0.2));
        float n2 = snoise(st * 3.2 - vec2(t * 0.3, n1 * 0.8));
        float n3 = snoise(st * 4.5 + vec2(n2 * 0.6, t * 0.1));

        float wave = sin((st.y + n1 * 0.35 + n2 * 0.25) * 8.0 + t * 2.0) * 0.5 + 0.5;
        float wave2 = cos((st.x - n2 * 0.4 + n3 * 0.3) * 6.0 - t * 1.5) * 0.5 + 0.5;

        // Silk Road color palette: Deep Obsidian, Turquoise (#00A896), Azure (#05B2D2), Royal Gold (#D4AF37)
        vec3 colorDeepNavy = vec3(0.027, 0.051, 0.118); // #070D1E
        vec3 colorTurquoise = vec3(0.0, 0.658, 0.588);  // #00A896
        vec3 colorAzure = vec3(0.02, 0.698, 0.823);      // #05B2D2
        vec3 colorGold = vec3(0.831, 0.686, 0.215);       // #D4AF37

        // Blend layers
        vec3 col = colorDeepNavy;
        col = mix(col, colorTurquoise, smoothstep(0.3, 0.8, n1 * 0.5 + 0.5) * 0.65);
        col = mix(col, colorAzure, smoothstep(0.4, 0.9, n2 * 0.5 + 0.5) * 0.5);
        col = mix(col, colorGold, smoothstep(0.65, 0.95, (n3 + wave * 0.4)) * 0.45);

        // Interactive mouse glow pulse
        float mouseGlow = smoothstep(0.4, 0.0, distToMouse) * 0.35;
        col += (colorGold * 0.6 + colorTurquoise * 0.4) * mouseGlow;

        // Subtle geometric Islamic star sparkle accents
        float grid = abs(sin(st.x * 30.0 + t)) * abs(cos(st.y * 30.0 - t));
        float starDust = smoothstep(0.88, 0.98, grid) * 0.12 * (n1 * 0.5 + 0.5);
        col += vec3(starDust);

        // Vignette fade
        float vignette = smoothstep(1.3, 0.3, length(v_uv - 0.5));
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

    // Fullscreen quad buffer
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
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = height - (e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

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
        zIndex: 0,
        ...style
      }}
    />
  );
};
