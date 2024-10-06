'use client';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProfileUser {
  id: string;
  username: string;
  about: string;
  profileImage: string;
  backgroundImage: string;
  followers: number;
  following: number;
  collections: string[];
  favoriteTags: string[];
}

import { useState, useEffect } from 'react';

interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    // Fetch collections data
    const fetchCollections = async () => {
      // Replace this with your actual API call
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data);
    };

    fetchCollections();
  }, []);

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleBackClick = () => {
    setSelectedCollection(null);
  };

  return (
    <div>
      {selectedCollection ? (
        <div>
          <div className="flex items-center mb-6">
            <Button onClick={handleBackClick} variant="ghost" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-2xl font-semibold">{selectedCollection.name}</h2>
          </div>
          <p className="mb-4">{selectedCollection.description}</p>
          {/* Add more details about the selected collection here */}
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6">My Collections</h2>
          <div className="grid grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card
                key={collection.id}
                className="shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCollectionClick(collection)}
              >
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold">{collection.name}</h4>
                  <p className="text-sm text-gray-600 mt-2">{collection.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


interface ProfilePageProps {
  user: ProfileUser;
  isOwnProfile: boolean;
}

const Profile: React.FC<ProfilePageProps> = ({ user, isOwnProfile }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Section - 25% */}
      <div className="w-1/4 p-6">
        <div className="bg-black rounded-xl shadow-lg p-6 sticky top-6 border border-gray-700 text-white">
          {/* Background Image */}
          <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4">
            <img
              src={user.backgroundImage}
              alt="Background"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Profile Picture */}
          <div className="relative -mt-16 flex justify-center mb-4">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-black shadow-md"
            />
          </div>




          {/* User Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{user.username}</h2>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm mb-6">
            <div className="text-center">
              <p className="font-semibold">{user.followers}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{user.following}</p>
              <p className="text-gray-400">Following</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{user.collections.length}</p>
              <p className="text-gray-400">Collections</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* About */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-300">{user.about}</p>
          </div>


          {isOwnProfile && (
            <>
              <Separator className="my-4" />

              {/* User Actions */}
              <div className="space-y-2">
              <h3 className="font-semibold">Quick Access</h3>
                <Button variant="secondary" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" /> My Collections
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" /> My Favorites
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" /> My Activity
                </Button>
              </div>
            </>
          )}

          <Separator className="my-4" />

          {/* Showcase Collections */}
          <div className="space-y-4">
            <h3 className="font-semibold">Showcase</h3>
            {user.collections.slice(0, 3).map((collection, index) => (
              <Button key={index} variant="secondary" className="w-full justify-between">
                <span>{collection}</span>
                <ArrowRight size={16} />
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Favorite Tags */}
          <div>
            <h3 className="font-semibold mb-4">Favorite Tags</h3>
            <div className="flex flex-wrap gap-2">
              {user.favoriteTags.map((tag, index) => (
                <span key={index} className="bg-gray-800 text-gray-200 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - 75% */}
      <div className="w-3/4 p-6">
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="collections">
            <Collections />
          </TabsContent>
          <TabsContent value="favorites">
            <h3 className="text-2xl font-semibold mb-6">Favorites</h3>
            {/* Add favorite items content here */}
          </TabsContent>
          <TabsContent value="activity">
            <h3 className="text-2xl font-semibold mb-6">Activity</h3>
            {/* Add activity content here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;