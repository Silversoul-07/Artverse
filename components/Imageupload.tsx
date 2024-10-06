'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import axios from 'axios';

interface FileWithMetadata extends File {
    file: File;
    preview: string;
    title: string;
    description: string;
    tags: string[];
}


export default function ImageUploadClient() {
    const [files, setFiles] = useState<FileWithMetadata[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [useSameMetadata, setUseSameMetadata] = useState<boolean>(true);
    const [globalMetadata, setGlobalMetadata] = useState({ title: '', description: '', tags: [] });
    const [selectedTags, setSelectedTags] = useState([]);
    const demoTags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', 'Tag6', 'Tag7'];

    const handleTagClick = (tag: string) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((t) => t !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    const processFiles = useCallback((inputFiles: File[]) => {
        const newFiles = inputFiles.filter(file => file.type.startsWith('image/')).map(file =>
            Object.assign(file, {
                file: file,
                preview: URL.createObjectURL(file),
                title: '',
                description: '',
                tags: []
            })
        );
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    }, [processFiles]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            processFiles(selectedFiles);
        }
    }, [processFiles]);

    const handleRemoveFile = useCallback((indexToRemove: number) => {
        setFiles(prevFiles => {
            const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);
            URL.revokeObjectURL(prevFiles[indexToRemove].preview);
            return newFiles;
        });
        if (currentIndex >= files.length - 1) {
            setCurrentIndex(Math.max(0, files.length - 2));
        }
    }, [files, currentIndex]);

    const handleMetadataChange = (key: string, value: string | string[]) => {
        if (useSameMetadata) {
            setGlobalMetadata(prev => ({ ...prev, [key]: value }));
        } else {
            setFiles(prevFiles => {
                const newFiles = [...prevFiles];
                newFiles[currentIndex] = { ...newFiles[currentIndex], [key]: value };
                return newFiles;
            });
        }
    };

    const handleUpload = async () => {
        let success = true;
        if (files.length === 0) {
            console.error('No files to upload');
            return;
        }
    
        for (const file of files) {
            const metadata = useSameMetadata ? globalMetadata : file;
    
            if (!metadata.title.trim()) {
                console.error('Title is mandatory');
                return;
            }

            const formData = new FormData();
            formData.append('image', file.file);
            formData.append('title', metadata.title);
            formData.append('desc', metadata.description);
            formData.append('tags', JSON.stringify(metadata.tags));
            formData.append('user_id', 'user123'); // Replace with actual user ID
            console.log('Uploading:', formData.get('tags'));
    
            try {
                const response = await axios.post('/api/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log('Upload successful:', response.data);
            } catch (error) {
                console.error('Upload failed:', error);
                success = false;
            }
        }
        if (success){setFiles([]);}
    };

    useEffect(() => {
        if (useSameMetadata) {
            setFiles(prevFiles => prevFiles.map(file => ({
                ...file,
                title: globalMetadata.title,
                description: globalMetadata.description,
                tags: globalMetadata.tags
            })));
        }
    }, [useSameMetadata, globalMetadata]);

    return (
        <Card className="bg-black text-white shadow-lg">
            <CardContent className="p-6 mx-4">
                <h2 className="text-2xl font-bold text-white mb-6 mt-2">Upload Image</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div
                        className={`border-2 rounded-lg p-4 text-center h-[450px] flex flex-col items-center justify-center cursor-pointer transition-colors ${files.length === 0 ? 'p-2 border-dashed border-gray-600 hover:border-gray-400' : 'border-solid border-gray-400'
                            }`}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        {files.length === 0 ? (
                            <>
                                <div className='text-gray-400 mb-2 break-all'>
                                    <img src="/upload.png" alt="Upload Icon" className="w-50 h-50" draggable="false" />
                                    <p>{"Drag & Drop"}</p>
                                    <p>OR</p>
                                </div>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button type="button" variant="secondary" size="sm">
                                    Select Files
                                </Button>
                            </>
                        ) : (
                            <img
                                src={files[currentIndex].preview}
                                alt="Preview"
                                className="object-cover rounded-md h-full w-full"
                                draggable={false}
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-3">


                        <label className="text-md font-medium text-white">Title *</label>
                        <Input
                            className='text-black'
                            placeholder="Title"
                            value={useSameMetadata ? globalMetadata.title : files[currentIndex]?.title || ''}
                            onChange={(e) => handleMetadataChange('title', e.target.value)}
                            required
                        />

                        <label className="text-md font-medium text-white">Description</label>
                        <Textarea
                            placeholder="Description"
                            className="resize-none text-black"
                            value={useSameMetadata ? globalMetadata.description : files[currentIndex]?.description || ''}
                            onChange={(e) => handleMetadataChange('description', e.target.value)}
                        />
                        <div>
                        <Label className="text-sm font-semibold text-gray-200">Tags</Label>

                            <ScrollArea className="w-full whitespace-nowrap">
                                <div className="flex space-x-2 pb-3">
                                    {demoTags.map((tag) => (
                                        <Button
                                            key={tag}
                                            variant="outline"
                                            size="sm"
                                            className={`shrink-0 rounded-lg transition ${selectedTags.includes(tag)
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                                                }`}
                                            onClick={() => {
                                                handleTagClick(tag);
                                                handleMetadataChange('tags', [...selectedTags, tag]);
                                            }}
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>

                        <label className="text-md font-medium text-white">Images</label>
                        <ScrollArea>
                            <div className="flex gap-4 pb-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    className='w-20 h-20 flex items-center justify-center rounded-md'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="sr-only">Add Image</span>
                                </Button>
                                {files.map((file, index) => (
                                    <div key={index} className={`relative overflow-hidden w-20 h-20 ${index === currentIndex ? 'ring-2 ring-white' : ''}`} onClick={() => setCurrentIndex(index)}>
                                        <Image src={file.preview} alt="Thumbnail" width={80} height={80} className="object-cover rounded-md w-full h-full" draggable={false} />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-0 right-0 h-4 w-4 rounded-full bg-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile(index);
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                                                <path fill="currentColor" fillRule="evenodd" d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z" clipRule="evenodd" className="size-4" aria-hidden="true" />
                                            </svg>
                                            <span className="sr-only">Remove file</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <div className="flex items-center space-x-2 mb-4">
                            <Checkbox
                                id="same-metadata"
                                checked={useSameMetadata}
                                onCheckedChange={(checked) => setUseSameMetadata(checked as boolean)}
                            />
                            <label htmlFor="same-metadata" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Use for all images
                            </label>
                        </div>


                    </div>

                </div>
                <div className="flex justify-center space-x-4 mt-3">
                    <Button type="button" variant="default" onClick={() => setFiles([])}>
                        Clear
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleUpload}>
                        Upload
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}