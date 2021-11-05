import type { FC, ReactNode } from 'react';
import { container, content } from './Card.css';
import React from 'react';

const Card: FC<{ children: ReactNode; containerClass: string; contentClass: string }> = ({
  children,
  containerClass,
  contentClass,
}) => (
  <section className={`${container} ${containerClass ?? ''}`}>
    <div className={`${content} ${contentClass ?? ''}`}>{children}</div>
  </section>
);
export { Card as default };
