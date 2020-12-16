import { RefObject, useEffect, useMemo, useRef } from 'react';
import { defaultFragmentShader, defaultVertexShader } from './defaultShaders';

type ShaderServiceOptions = {
  vertexShaderSource: string;
  fragmentShaderSource: string;
};

const defaultOptions: ShaderServiceOptions = {
  vertexShaderSource: defaultVertexShader,
  fragmentShaderSource: defaultFragmentShader,
};

export class ShaderService {
  private canvas: HTMLCanvasElement;
  private options: ShaderServiceOptions;

  private gl: WebGLRenderingContext;
  private program: WebGLProgram;

  private resolutionLocation: WebGLUniformLocation;
  private timeLocation: WebGLUniformLocation;

  private startTime = Date.now();
  private paused = false;
  private rafId = 0;

  private boundResizeHotListener: () => void;
  private resizeObserver: ResizeObserver;

  constructor(canvas: HTMLCanvasElement, options: ShaderServiceOptions) {
    this.canvas = canvas;
    this.options = options;

    this.resize();
    this.boundResizeHotListener = this.resizeHot.bind(this);
    window.addEventListener('resize', this.boundResizeHotListener);
    this.resizeObserver = new ResizeObserver(this.boundResizeHotListener);
    this.resizeObserver.observe(this.canvas);

    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('cannot get wegbl context');
    }
    this.gl = gl;

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
      gl.STATIC_DRAW,
    );

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      throw new Error('cannot create vertex shader');
    }
    gl.shaderSource(vertexShader, options.vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      throw new Error('cannot create fragment shader');
    }
    gl.shaderSource(fragmentShader, options.fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) {
      throw new Error('cannot create gl program');
    }
    this.program = program;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    if (!resolutionLocation) {
      throw new Error('cannot get resolution location');
    }
    this.resolutionLocation = resolutionLocation;
    gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    if (!timeLocation) {
      throw new Error('cannot get time location');
    }
    this.timeLocation = timeLocation;
    gl.uniform1f(timeLocation, 0);

    const render = () => {
      if (this.paused) {
        this.rafId = window.requestAnimationFrame(render);
        return;
      }

      gl.uniform1f(timeLocation, (Date.now() - this.startTime) / 700);
      gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);

      const positionLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      this.rafId = window.requestAnimationFrame(render);
    };

    render();
  }

  private resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  private resizeHot() {
    this.resize();
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  destroy() {
    window.cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.boundResizeHotListener);
    this.resizeObserver.disconnect();
  }
}

export const useShaderService = (
  canvasRef: RefObject<HTMLCanvasElement>,
  options?: Partial<ShaderServiceOptions>,
) => {
  const service = useRef<ShaderService>();

  const mergedOptions: ShaderServiceOptions = useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    [options],
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    service.current = new ShaderService(canvasRef.current, mergedOptions);
    return () => service.current?.destroy();
  }, [canvasRef, mergedOptions]);

  return service;
};
