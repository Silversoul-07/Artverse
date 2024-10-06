import React from 'react'; 

export default function PageLayout({ children }:  Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className='bg-[url(/bg-login.jpg)] bg-cover bg-center h-screen'>
            {children}
        </main>
    );
}