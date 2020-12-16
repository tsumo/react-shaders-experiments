import { RefObject, useEffect, useMemo, useRef } from 'react';
import { defaultFragmentShader, defaultVertexShader } from './defaultShaders';
import { ShaderService, ShaderServiceOptions } from './ShaderService';

const defaultOptions: ShaderServiceOptions = {
  vertexShaderSource: defaultVertexShader,
  fragmentShaderSource: defaultFragmentShader,
};

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
