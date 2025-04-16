"use client";

import { useState } from "react";

interface TechxosVideoProps {
  videoId?: string;
  title?: string;
  description?: string;
}

export default function TechxosVideo({ 
  videoId = "YOUR_DEFAULT_VIDEO_ID", // Replace with your actual video ID
  title = "Course Preview",
  description = "Watch this video to learn more about our course"
}: TechxosVideoProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div className="mt-4 text-center">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  );
} 