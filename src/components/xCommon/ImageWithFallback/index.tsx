'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

function ImageWithFallback({
  src,
  alt = '',
  width,
  height,
  fallBackImg = '',
  ...props
}: any) {
  const [imgSrc, setImgSrc] = useState(
    fallBackImg ||
      `https://placehold.co/${width}x${height}?text=${encodeURIComponent(alt)}`,
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Effect to update the image source to the main image once the component is mounted
  useEffect(() => {
    if (!isImageLoaded) {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsImageLoaded(true);
      };
      img.onerror = () => {
        setImgSrc(
          fallBackImg ||
            `https://placehold.co/${width}x${height}?text=${encodeURIComponent(alt)}`,
        );
      };
    }
  }, [src, fallBackImg, width, height, alt, isImageLoaded]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      height={height}
      width={width}
      loading="lazy"
    />
  );
}

export default ImageWithFallback;
