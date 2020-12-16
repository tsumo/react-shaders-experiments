import { ResizeContainer } from 'components/ResizeContainer/ResizeContainer';
import { Shader } from 'components/Shader/Shader';
import s from 'App.module.scss';

export const App = () => {
  return (
    <div className={s.root}>
      <ResizeContainer>
        <Shader />
      </ResizeContainer>
    </div>
  );
};
