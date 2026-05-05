"use client";

import React, { useRef, useEffect } from "react";

interface HeroVideoProps {
  src?: string;
  className?: string;
}

export function HeroVideo({ src = "/assets/hero-bg.mp4", className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video plays with correct settings for transparent background
    video.play().catch(() => {
      // Auto-play blocked, will show poster or fallback
    });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
      className={className}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          transform: "translate(-50%, -50%)",
          objectFit: "cover",
          // Fix transparency issues
          mixBlendMode: "normal",
          opacity: 1,
        }}
        // For transparent videos (WebM with alpha or HEVC), use specific mime type
        // If the video has transparency, ensure it's WebM VP9 or HEVC with alpha
      >
        <source src={src} type="video/mp4" />
        {/* Fallback for browsers that support WebM with alpha */}
        <source src={src.replace(".mp4", ".webm")} type="video/webm;codecs=vp9" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay to ensure text readability if video is too bright */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.1) 50%, rgba(10,10,10,0.4) 100%)",
          zIndex: 1,
        }}
      />
    </div>
  );
}
