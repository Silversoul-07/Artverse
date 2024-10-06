'use client';
import Layout from "@/components/Layout";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Page = () => {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const breakpoints = {
    default:5,
    1100: 3,
    700: 2,
    500: 2,
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/random-images',{});
        setItems(response.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setError('Failed to fetch items');
      }
    };

    fetchItems();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <main className=" lg:mx-8 px-2 lg:px-4">
      <Layout items={items} />
    </main>
  );
};

export default Page;