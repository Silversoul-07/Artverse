import React from 'react'
import ImageUploadClient from '@/components/Imageupload';
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: 'Create'
}

export default function ImageUploadPage() {
  return (
    <section className='max-w-[800px] mx-auto my-7'>
      <ImageUploadClient />
    </section>
  )
}