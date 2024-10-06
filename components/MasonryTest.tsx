import React, { useEffect, useRef, useState } from 'react';
import imagesLoaded from 'imagesloaded';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const MasonryLayout = ({ items }) => {
  const [loaded, setLoaded] = useState(false);
  const masonryRef = useRef(null);

  useEffect(() => {
    if (masonryRef.current) {
      imagesLoaded(masonryRef.current, () => {
        setLoaded(true);
      });
    }
  }, [items]);

  const getItemDelay = (index) => {
    // Adjust this logic to calculate the delay based on column and row
    const columnIndex = index % 5; // assuming 5 columns
    return columnIndex * 1; // stagger each column by 0.2s
  };

  return (
    <div ref={masonryRef} className={`masonry-layout ${loaded ? 'loaded' : ''}`}>
      <style>{`
        .masonry-layout {
          column-count: 3;
          column-gap: 8px;
          opacity: 0;
          transition: opacity 0.9s;
        }
        
        .masonry-layout.loaded {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .masonry-layout {
            column-count: 2;
          }
        }
        
        @media (max-width: 480px) {
          .masonry-layout {
            column-count: 1;
          }
        }
        
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 8px;
        }
        
        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .masonry-item h3 {
          margin-top: 2px;
          font-size: 18px;
        }
      `}</style>
      {items.map((item, index) => {
  const columnIndex = index % 5; // Adjust based on the number of columns
  return (
    <motion.div
      key={item.id}
      className="masonry-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.9, delay: columnIndex * 0.2 }} // Column-wise delay
    >
      <Card className="bg-transparent border-0 relative group rounded-none">
        <CardContent>
          <div className="overflow-hidden relative object-cover w-full h-full border border-grey-800 rounded-lg min-h-[200px]">
            <Link href={`/visual-search/` + item.id}>
              <img src={`/images/${item.url}`} alt={item.title} />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
})}
    </div>
  );
};

