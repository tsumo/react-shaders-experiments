import { useRef } from 'react';
import { useShaderService } from 'services/useShaderService';

export const Shader = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useShaderService(ref);

  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
};
