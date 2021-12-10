import { container } from '$components/BannerImage.css';
import type { JSX } from 'react';
import { useEffect } from 'react';
import lazyload from 'vanilla-lazyload';

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

const BannerImage = function BannerImage({ imageData }: BannerImageProps): JSX.Element {
  const { alt, width, height, src, sources, placeholder } = imageData;
  const sizes = '(max-width: 672px) calc(100vw - 32px), 672px';
  const ssr = import.meta.env.SSR;

  useEffect(() => {
    if (!ssr && !window.document.lazyloadInstance) {
      window.document.lazyloadInstance = new lazyload();
    }
  }, [ssr]);

  useEffect(() => {
    if (!ssr) {
      document.lazyloadInstance.update();
    }
  }, [placeholder, sources, src, ssr]);

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
          src={placeholder}
          objectFit="contain"
          style={{ maxWidth: '100%' }}
        />
      </picture>
    </div>
  );
};

export default BannerImage;
