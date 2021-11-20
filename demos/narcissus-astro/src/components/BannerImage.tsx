import React from 'react';
import type { FC } from 'react';
import { container } from './BannerImage.css';

interface BannerImageProps {
  imageData: {
    alt: string;
    width: number;
    height: number;
    src: string;
    sources: { srcset: string; type: string }[];
    placeholder: string;
  };
}

const BannerImage: FC<BannerImageProps> = function BannerImage({ imageData }) {
  const { alt, width, height, src, sources, placeholder } = imageData;
  const sizes = '(max-width: 672px) calc(100vw - 32px), 672px';
  console.log('src: ', src);
  return (
    <div className={container}>
      <picture>
        {sources.map((element) => {
          const { srcset, type } = element;
          return (
            <source
              data-sizes={sizes}
              data-srcset={srcset}
              key={type}
              type={type}
              width={width}
              height={height}
            />
          );
        })}
        <img
          className="lazy"
          alt={alt}
          importance="high"
          loading="eager"
          decoding="async"
          width={width}
          height={height}
          data-src={src}
          src={src}
          objectFit="contain"
        />
      </picture>
    </div>
  );
};

export default BannerImage;