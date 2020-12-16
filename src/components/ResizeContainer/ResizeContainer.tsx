import { FC } from 'react';
import s from './ResizeContainer.module.scss';

interface ResizeContainerProps {
  width?: number;
  height?: number;
}

export const ResizeContainer: FC<ResizeContainerProps> = ({
  width = 300,
  height = 300,
  children,
}) => {
  return (
    <div className={s.root} style={{ width, height }}>
      {children}
    </div>
  );
};
