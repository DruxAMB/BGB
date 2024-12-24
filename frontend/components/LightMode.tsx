import React from 'react';
import Image from 'next/image';
interface LightModeProps {
  children: React.ReactNode;
}

const LightMode: React.FC<LightModeProps> = ({ children }) => {
  return (
    <div className="relative bg-white bg-cover bg-bottom bg-no-repeat h-full w-full">
      <Image
        src="/bg-light.png"
        className="absolute bottom-0 left-0 w-full"
        alt=""
        width={5000}
        height={5000}
        quality={100}
      />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};

export default LightMode;
