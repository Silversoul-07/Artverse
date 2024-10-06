import React from 'react';
import Masonry from '@/components/Masonry';

const TwoColumnLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Left section: Full image */}
      <div className="w-1/2 bg-gray-200">
        {/* You can add your image here using the main image method */}
        {/* For example: <Image src="/your-image.jpg" layout="fill" objectFit="cover" /> */}
      </div>

      {/* Right section: Infinite scroll masonry */}
      <div className="w-1/2 overflow-y-auto">
        {/* You can add your masonry component here */}
        {/* For example: <MasonryComponent /> */}
        {/* <Masonry /> */}
        <h1>Two Column Layout</h1>
      </div>
    </div>
  );
};

export default TwoColumnLayout;