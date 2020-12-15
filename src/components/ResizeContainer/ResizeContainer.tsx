import { FC } from 'react';
import s from './ResizeContainer.module.scss';

export const ResizeContainer: FC = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
