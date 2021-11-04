import type { ReactNode } from 'react';
import { container, content } from './Card.css';
import React from 'react';

const Card = ({
  children,
  containerClass,
  contentClass,
}: {
  children: ReactNode;
  containerClass: string;
  contentClass: string;
}) => (
  <section className={`${container} ${containerClass ?? ''}`}>
    <div className={`${content} ${contentClass ?? ''}`}>{children}</div>
  </section>
);
export { Card as default };
