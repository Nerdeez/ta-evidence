import type { ComponentProps } from 'react';

type ImageProps = ComponentProps<'img'> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
};

export default function Image({ src, alt, width, height, className, ...props }: ImageProps) {
  return <img src={src} alt={alt} width={width} height={height} className={className} {...props} />;
}
