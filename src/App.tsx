import React, { useRef } from 'react';
import { useShaderService } from 'service/ShaderService';
import s from 'App.module.scss';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderService = useShaderService(canvasRef);

  return (
    <div className={s.root}>
      <canvas ref={canvasRef} className={s.canvas} />
    </div>
  );
};

export default App;
