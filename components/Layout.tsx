'use client';
import React, { useState, useEffect, useRef, use } from 'react';
import Masonry from 'react-masonry-css';
import imagesLoaded from 'imagesloaded';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Search } from 'lucide-react';
import axios from 'axios';


interface Images{
  id: number;
  url: string;
  title: string;
  desc: string;
  tags: string[];
  collections: string[];
  is_nsfw: boolean;
  metadata_: any;
  created_at: string;
}

interface LayoutProps {
  items: Array<{
    id: number;
    url: string;
    title: string;
  }>;
}


const postLike = async (id: number) => {
  try {
    const formData = new FormData();
    formData.append('id', id.toString());
    const response = await axios.post('/api/like', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to post like');
    }
    console.log('Like posted successfully');
  } catch (error) {
    console.error('Error posting like:', error);
  }
};

const postDislike = async (id: number) => {
  try {
    const formData = new FormData();
    formData.append('id', id.toString());

    const response = await axios.post('/api/dislike', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200) {
      throw new Error('Failed to post dislike');
    }
    console.log('Dislike posted successfully');
  } catch (error) {
    console.error('Error posting dislike:', error);
  }
};


const postView = async (id: number) => {
  try {
    const formData = new FormData();
    formData.append('id', id.toString());

    const response = await axios.post('/api/view', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to post view');
    }
    console.log('View posted successfully');
  } catch (error) {
    console.error('Error posting view:', error);
  }
};

const LazyImage: React.FC<{ id: number; src: string; alt: string }> = ({ id, src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            postView(id); // Post view when image comes into view
            observer.unobserve(entry.target);
          } else {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (isVisible) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [isVisible]);

  const handleLike = () => {
    postLike(id);
  };

  const handleDislike = () => {
    postDislike(id);
  };

  const handleTouchStart = () => {
    setIsHovered(true);
    setTimeout(() => {
      setIsHovered(false);
    }, 10000); // Hide buttons after 10 seconds
  };

  return (
    <div
      ref={imgRef}
      className="w-full h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      {isLoaded ? (
        <div className='flex flex-col gap-2'>
          <Link href={`/view/${id}`}>
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          </Link>
          {isHovered && (
            <>
              <button
                className="absolute top-2 right-2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all duration-200 ease-in-out"
                onClick={handleLike}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                className="absolute top-[45px] right-2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all duration-200 ease-in-out"
                onClick={handleDislike}
              >
                <ThumbsDown size={16} />
              </button>
              <Link href={`/visual-search/${id}`} className="absolute top-[81px] right-2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all duration-200 ease-in-out">
                <Search size={16} />
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ items }) => {

  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };
  const [imagesLoadedState, setImagesLoadedState] = useState(false);
  const masonryRef = useRef(null);
  useEffect(() => {
    if (masonryRef.current) {
      imagesLoaded(masonryRef.current, () => {
        setImagesLoadedState(true);
      });
    }
  }, [items]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-left my-4 lg:my-8 lg:mb-4 text-white pl-4">Discover</h1>
      </div>
      <Masonry
        ref={masonryRef}
        breakpointCols={breakpoints}
        className="flex w-auto"
        columnClassName="bg-clip-padding"
      >
        {items.map((item, index) => (
            <Card className='bg-transparent border-0 relative group p-[4.5px] lg:p-[4px] rounded-none' key={index}>
              <CardContent>
                <div className="overflow-hidden relative object-cover w-full h-full border border-grey-800 rounded-lg min-h-[200px]">
                  <LazyImage id={item.id} src={`/${item.url}`} alt={`Image ${index}`} />
                </div>
              </CardContent>
            </Card>
        ))}
      </Masonry>
    </>
  );
};

export default Layout;
