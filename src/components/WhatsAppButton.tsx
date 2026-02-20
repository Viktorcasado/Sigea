"use client";

import React from 'react';
import { usePlatform } from '@/src/hooks/usePlatform';

const WhatsAppButton = () => {
  const { isMobile, isIos } = usePlatform();

  // Ajusta a distância do fundo baseado na plataforma
  const bottomSpacing = isMobile ? (isIos ? '100px' : '80px') : '30px';

  return (
    <>
      <style>
        {`
          :root {
            --icon-color: #fff;
            --icon-hover: #fff;
            --background-color: #00c800;
            --background-hover: #009600;
          }
          .whatsapp-icon {
            width: 32px;
            height: 32px;
            fill: var(--icon-color);
            pointer-events: none;
          }
          .whatsapp-float {
            position: fixed;
            cursor: pointer;
            width: 56px;
            height: 56px;
            bottom: ${bottomSpacing};
            right: 20px;
            transition: 0.3s;
            background-color: var(--background-color);
            border-radius: 50%;
            z-index: 40;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          @media (min-width: 1024px) {
            .whatsapp-float {
              width: 64px;
              height: 64px;
              bottom: 30px;
              right: 30px;
            }
            .whatsapp-icon {
              width: 38px;
              height: 38px;
            }
          }

          .whatsapp-float:hover {
            background-color: var(--background-hover);
            transform: scale(1.05);
          }
          @keyframes whatsapp-pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 200, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 200, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 200, 0, 0); }
          }
          .whatsapp-float {
            animation: whatsapp-pulse 2s infinite;
          }
        `}
      </style>
      <a 
        href="https://api.whatsapp.com/send?phone=5582996281235" 
        className="whatsapp-float" 
        aria-label="Botão para contato no WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="whatsapp-icon" viewBox="0 0 48 48">
          <path d="M.33,48.33,3.06,35.62A23.67,23.67,0,0,1,0,24,24.06,24.06,0,0,1,24.12,0h0a23.95,23.95,0,1,1,0,47.89,24.33,24.33,0,0,1-11-2.61ZM13.7,41.08l.67.36a20.3,20.3,0,0,0,9.74,2.49A20,20,0,1,0,4,24a19.78,19.78,0,0,0,2.89,10.3l.41.68L5.52,43Z" />
          <path d="M34.67,31.75C34.22,33,32,34.21,31,34.31S30,35.12,24.5,33s-9-7.77-9.27-8.13S13,21.92,13,19.27a6.08,6.08,0,0,1,1.89-4.5,2,2,0,0,1,1.45-.67c.36,0,.72.05,1,.05s.77-.18,1.22.9,1.54,3.72,1.67,4a1,1,0,0,1,.05.95,3.53,3.53,0,0,1-.54.89c-.28.32-.58.71-.82.95s-.55.56-.24,1.09a16.48,16.48,0,0,0,3,3.73,14.93,14.93,0,0,0,4.37,2.68c.54.26.86.22,1.17-.14s1.36-1.58,1.72-2.12.72-.45,1.22-.26,3.17,1.47,3.71,1.74.9.41,1,.63A4.4,4.4,0,0,1,34.67,31.75Z" />
        </svg>
      </a>
    </>
  );
};

export default WhatsAppButton;