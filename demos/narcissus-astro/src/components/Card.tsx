import React from 'react';
import type { FC, ReactNode } from 'react';
import { container, content } from './Card.css';

interface CardProps {
  children: ReactNode;
  containerClass: string;
  contentClass: string;
}

const Card: FC<CardProps> = function Card({ children, containerClass, contentClass }) {
  return (
    <section className={`${container} ${containerClass ?? ''}`}>
      <div className={`${content} ${contentClass ?? ''}`}>{children}</div>
    </section>
  );
};

export default Card;
