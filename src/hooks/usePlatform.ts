"use client";

import { useState, useEffect } from 'react';

export type Platform = 'ios' | 'android' | 'desktop';

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform>('desktop');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIos) {
      setPlatform('ios');
      setIsMobile(true);
    } else if (isAndroid) {
      setPlatform('android');
      setIsMobile(true);
    } else {
      setPlatform('desktop');
      setIsMobile(window.innerWidth < 1024);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024 || isIos || isAndroid);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { platform, isMobile, isIos: platform === 'ios', isAndroid: platform === 'android', isDesktop: platform === 'desktop' };
};