import { RefObject, useEffect, useRef } from 'react';

export class ShaderService {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }
}

export const useShaderService = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const service = useRef<ShaderService>();

  useEffect(() => {
    if (canvasRef.current) {
      service.current = new ShaderService(canvasRef.current);
    }
  }, [canvasRef]);

  return service;
};
