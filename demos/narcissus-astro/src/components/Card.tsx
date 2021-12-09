import React from 'react';
import type { FC } from 'react';
import { container, content } from '$components/Card.css';

interface CardProps {
  containerClass?: string;
  contentClass?: string;
}

const Card: FC<CardProps> = function Card({ children, containerClass, contentClass }) {
  return (
    <section className={`${container} ${containerClass ?? ''}`}>
      <div className={`${content} ${contentClass ?? ''}`}>{children}</div>
    </section>
  );
};

Card.defaultProps = {
  containerClass: '',
  contentClass: '',
};

export default Card;
