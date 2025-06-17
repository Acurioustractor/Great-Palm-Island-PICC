'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProfileImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  style?: React.CSSProperties;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ProfileImage({ src, alt, fallbackSrc, style, fill, width, height }: ProfileImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return fill ? (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      style={style}
      onError={() => setImgSrc(fallbackSrc)}
    />
  ) : (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      width={width}
      height={height}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}