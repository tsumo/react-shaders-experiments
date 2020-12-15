import { useRef } from 'react';
import { useShaderService } from 'service/ShaderService';
import { ResizeContainer } from 'components/ResizeContainer/ResizeContainer';
import s from 'App.module.scss';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderService = useShaderService(canvasRef);

  return (
    <div className={s.root}>
      <ResizeContainer>
        <canvas ref={canvasRef} className={s.canvas} />
      </ResizeContainer>
    </div>
  );
};

export default App;
