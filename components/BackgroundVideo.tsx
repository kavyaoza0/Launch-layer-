import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface BackgroundVideoProps {
  className?: string;
}

const MUX_HLS_URL = 'https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8';

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // Check for native HLS playback (Safari, iOS Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = MUX_HLS_URL;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      });
    } else if (Hls.isSupported()) {
      // Hls.js fallback for Chrome, Edge, Firefox, etc.
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
      });

      hls.loadSource(MUX_HLS_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Fullscreen Background HLS Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover opacity-100 transition-opacity duration-1000"
      />

      {/* Atmospheric Contrast Overlay: Keeps the video vibrant while ensuring crisp text readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 pointer-events-none transition-colors duration-500" />
    </div>
  );
};

export default BackgroundVideo;
