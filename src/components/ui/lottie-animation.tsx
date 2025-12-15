"use client";

import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: object;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export const LottieAnimation = ({ 
  animationData, 
  width = 200, 
  height = 200,
  loop = true,
  autoplay = true,
  className = ""
}: LottieAnimationProps) => {
  return (
    <div className={className} style={{ width, height }}>
      <Lottie 
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};
