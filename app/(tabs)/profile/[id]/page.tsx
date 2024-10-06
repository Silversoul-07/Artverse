import Profile from "@/components/Profile";
import { Metadata } from "next";

// dynamic metadata
export const generateMetadata = (): Metadata => {
  return {
    title: "Image Viewer",
    description: "View images and related images",
  };
};

export default function page({ params }: { params: { id: string } }){
    const { id } = params;
    const  user= {
        id: '123',
        username: 'testuser',
        about: 'This is a test user.',
        profileImage: 'http://example.com/profile.jpg',
        backgroundImage: 'http://example.com/background.jpg',
        followers: 100,
        following: 50,
        collections: ['collection1', 'collection2'],
        favoriteTags: ['tag1', 'tag2']
      };

    return (
        <main>
            <Profile user={user} isOwnProfile={true} />
        </main>
    );
}