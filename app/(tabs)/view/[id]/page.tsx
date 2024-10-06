'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link2, ThumbsDown, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Masonry from 'react-masonry-css';
import { Eye, EyeOff } from 'lucide-react';

interface ImageData {
  id: number;
  url: string;
  title: string;
  desc: string;
  tags: string[];
  is_nsfw: boolean;
  metadata_: {
    dim: number[];
    file_size: string;
    mime_type: string;
    source: string;
  };
  created_at: string;
}

interface RelatedImage {
  id: number;
  url: string;
  title: string;
  is_nsfw: boolean;
}
function extractWebsiteName(url: string) {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[parts.length - 2] : hostname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

const ImageViewPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [image, setImage] = useState<ImageData | null>(null);
  const [relatedImages, setRelatedImages] = useState<RelatedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showNSFW, setShowNSFW] = useState(false);

  const toggleNSFW = () => {
    setShowNSFW(!showNSFW);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get<ImageData>(`/api/media/${params.id}`);
        setImage(response.data);
      } catch (error) {
        console.error('Failed to fetch image:', error);
        setError('Failed to fetch image');
      }
    };

    const fetchRelatedImages = async () => {
      try {
        const response = await axios.get<RelatedImage[]>('/api/random-images');
        setRelatedImages(response.data);
      } catch (error) {
        console.error('Failed to fetch related images:', error);
        setError('Failed to fetch related images');
      }
    };

    fetchImage();
    fetchRelatedImages();
  }, [params.id]);

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  if (!image) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Image */}
          <div className="lg:w-3/4 h-[calc(100vh-150px)]">
            <Card className="bg-black h-full overflow-hidden">
            <div className="relative h-full">
      <div className="h-full flex items-center justify-center">
        <img
          src={`/${image.url}`}
          alt={image.title}
          className={`max-h-full object-contain ${!image.is_nsfw && !showNSFW ? 'filter blur-lg' : ''}`}
        />
        {!image.is_nsfw && !showNSFW && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-2xl font-bold text-white">NSFW Content</p>
          </div>
        )}
      </div>
      {!image.is_nsfw && (
        <Button
          className="absolute bottom-4 right-4"
          onClick={toggleNSFW}
          variant="secondary"
        >
          {showNSFW ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
          {showNSFW ? 'Hide Content' : 'View Content'}
        </Button>
      )}
    </div>
              <div className="p-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="mr-2 h-4 w-4" /> Dislike
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Link2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        
          {/* Image Details */}
          <div className="lg:w-1/4 h-[calc(100vh-150px)] text-white">
            <Card className="bg-transparent h-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 font-semibold text-white">AI Artist</span>
                </div>
                <Button variant="outline" size="sm" className="border-purple-400 text-white">
                  Follow
                </Button>
              </div>
        
              <h2 className="text-2xl font-bold mb-4 text-white">{image.title}</h2>
        
              <ScrollArea className="pr-4 h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white">Description</h3>
                    <p className="text-sm text-white">{image.desc}</p>
                  </div>
        
                  <Separator />
        
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {image.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-white">{tag}</Badge>
                      ))}
                    </div>
                  </div>
        
                  <Separator />
        
                  <div className="grid grid-cols-2 gap-4 text-sm text-white">
                    <div>
                      <h4 className="font-semibold text-white">Dimensions</h4>
                      <p>{image.metadata_.dim.join(' x ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Size</h4>
                      <p>{image.metadata_.file_size}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Type</h4>
                      <p>{image.metadata_.mime_type}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Source</h4>
                      <a href={image.metadata_.source} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                        {extractWebsiteName(image.metadata_.source)}
                      </a>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Created</h4>
                      <p>{new Date(image.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">NSFW</h4>
                      <p>{image.is_nsfw ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>

        {/* Masonry Layout for Related Images */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Images</h3>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex w-auto -ml-4"
            columnClassName="pl-4 bg-clip-padding"
          >
            {relatedImages.map((relatedImage) => (
              <Card key={relatedImage.id} className="mb-4 bg-transparent overflow-hidden">
                <div className="relative">
                  <img
                    src={`/${relatedImage.url}`}
                    alt={relatedImage.title}
                    className={`w-full h-auto object-cover ${relatedImage.is_nsfw ? 'filter blur-lg' : ''}`}
                  />
                  {relatedImage.is_nsfw && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <p className="text-lg font-bold">NSFW</p>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">{relatedImage.title}</p>
                </div>
              </Card>
            ))}
          </Masonry>
        </div>
      </div>
    </main>
  );
};

export default ImageViewPage;