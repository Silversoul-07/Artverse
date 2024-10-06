'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Camera, ChevronDown, X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import axios from 'axios';
import Cookie from 'js-cookie';

const navItems = [
    { name: 'Explore', href: '/explore' },
    { name: 'Create', href: '/create' },
];


const VisualSearchComponent = ({ onClose, onSearch }) => {
    const [imageLink, setImageLink] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onSearch(file);
    };

    const handlePaste = async () => {
        if (imageLink) {
            try {
                const response = await fetch(imageLink);
                const blob = await response.blob();
                const file = new File([blob], "pasted_image.jpg", { type: blob.type });
                onSearch(file);
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        }
    };

    return (
        <Card className="w-full bg-gray-900 text-white"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Search any image with Google Lens</h2>
                    <X className="cursor-pointer" size={20} onClick={onClose} />
                </div>

                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 mb-4 text-center">
                    <div className="inline-block bg-blue-500 p-2 rounded mb-2">
                        <img src="/api/placeholder/24/24" alt="Upload icon" className="w-6 h-6" />
                    </div>
                    <p className="text-sm">
                        Drag an image here or <label className="text-blue-400 underline cursor-pointer">
                            <input type="file" className="hidden" onChange={(e) => onSearch(e.target.files[0])} />
                            upload a file
                        </label>
                    </p>
                </div>

                <div className="text-center text-sm mb-4">OR</div>

                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Paste image link"
                        className="flex-grow bg-gray-800 border-gray-700 text-white"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                    />
                    <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePaste}>
                        Search
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const Header = () => {
    const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
    const [session, setSession] = useState(() => {
        // Initialize session state from local storage or cookies
        const cachedSession = localStorage.getItem('session');
        return cachedSession ? JSON.parse(cachedSession) : null;
    });

    useEffect(() => {
        if (session) return;

        const userSession = Cookie.get('token');
        if (userSession) {
            setSession(userSession);
            return;
        }

        axios.get('/api/session')
            .then((response) => {
                console.log('Response data:', response.data);
                localStorage.setItem('session', JSON.stringify(response.data));
                setSession(response.data);
            })
            .catch((error) => {
                console.error('Error fetching session:', error);
            });
    }, [session]);

    //on logout set cookie token to empty string
    const handleLogout = async () => {
        try {
            Cookie.set('token', '');
            window.location.href = '/';
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    const handleVisualSearch = async (file) => {
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('title', 'Uploaded image');
            formData.append('desc', 'Uploaded image');
            formData.append('tags', JSON.stringify(['uploaded']));
            formData.append('user_id', 'user123'); // Replace with actual user ID

            try {
                const upload = await axios.post('/api/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                console.log('Uploaded image:', upload.data);
                window.location.href = `/visual-search/${upload.data.image_id}`;
                console.log('Uploaded image:', data);
                setIsVisualSearchOpen(false);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 text-white py-3 border-b border-gray-400 bg-black">
            <div className="mx-4 lg:mx-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                {/* Logo and Navigation */}
                <div className="flex items-center space-x-4">
                    <Link href="/" className='text-xl'>Artverse</Link>
                    <nav className="hidden md:flex items-center">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href} className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-full" })}>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Centered Search */}
                <div className="relative w-[430px]">
                    <div className="relative w-full">
                        <form action="/search" method="get" className="flex items-center w-full">
                            <div className="relative w-full">
                                <svg className='absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                    <path fill="#616161" d="M34.6 28.1H38.6V45.1H34.6z" transform="rotate(-45.001 36.586 36.587)"></path>
                                    <path fill="#616161" d="M20 4A16 16 0 1 0 20 36A16 16 0 1 0 20 4Z"></path>
                                    <path fill="#37474F" d="M36.2 32.1H40.2V44.400000000000006H36.2z" transform="rotate(-45.001 38.24 38.24)"></path>
                                    <path fill="#64B5F6" d="M20 7A13 13 0 1 0 20 33A13 13 0 1 0 20 7Z"></path>
                                    <path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"></path>
                                </svg>
                                <Input
                                    type="search"
                                    placeholder="Search for anything..."
                                    className="bg-gray-800 text-white pl-10 pr-12 py-2 w-full rounded-full"
                                    name='query'
                                />
                            </div>
                        </form>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2"
                            onClick={() => setIsVisualSearchOpen(!isVisualSearchOpen)}
                        >
                            <Camera className="h-5 w-5" />
                        </Button>
                    </div>
                    {isVisualSearchOpen && (
                        <div className="absolute inset-0 z-10">
                            <VisualSearchComponent
                                onClose={() => setIsVisualSearchOpen(false)}
                                onSearch={handleVisualSearch}
                            />
                        </div>
                    )}
                </div>

                {/* User Session or Login/Signup */}
                <div className="flex items-center justify-end space-x-4">
                    {session?.name ? (
                        <>
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session.avatar} alt={session.name} />
                                    <AvatarFallback>{session.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className='size-4 rounded-full'>
                                            <ChevronDown className="h-4 w-4 text-white hover:text-black" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuItem className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{session.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{session.email}</p>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="/profile">View Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="/settings">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <button onClick={handleLogout}>Logout</button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button variant="default" asChild size="sm" className="hidden sm:block">
                                <Link href="/auth/signup">Signup</Link>
                            </Button>
                            <Button variant="secondary" asChild size="sm">
                                <Link href="/auth/login">Login</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;