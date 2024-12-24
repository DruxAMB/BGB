import React from 'react';

const VideoBackground = ({
  videoSrc,
  children,
}: {
  videoSrc: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-[-1]"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay Content */}
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};

export default VideoBackground;
