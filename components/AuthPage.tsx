'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import bg from '@/public/bg.jpg';

interface AuthPageProps {
  formType: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ formType }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const details = formType === "signup"
    ? {
        title: "Create an Account",
        description: "Join us today and start your journey.",
        span: "Already have an account? ",
        href: "/auth/login",
        anchor: "Log in",
        buttonText: "Sign Up"
      }
    : {
        title: "Welcome Back",
        description: "Log in to access your account.",
        span: "Don't have an account? ",
        href: "/auth/signup",
        anchor: "Sign up",
        buttonText: "Log In"
      };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (formType === 'signup') {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          router.push('/auth/login');
        } else {
          alert('Sign up failed. Please try again.');
        }
      } else {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const { access_token } = await response.json();
          if (!access_token) {
            throw new Error('No token received');
        }
    
        Cookies.remove('token');
        Cookies.set('token', access_token, { expires: 30 });
          router.push('/');
        } else {
          alert('Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Link href={'/'} className="absolute top-8 left-8 text-3xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
        Arcana
      </Link>
      <div className="w-full max-w-4xl mx-auto flex shadow-2xl rounded-lg overflow-hidden">
        <div className="relative hidden lg:block lg:w-1/2">
          <Image src={bg} alt="Background" layout="fill" objectFit="cover" className="rounded-l-lg" />
          <div className="absolute inset-0 opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">Discover Artverse</h2>
            <p className="text-lg">Unlock the secrets of the universe with our cutting-edge platform.</p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-12 bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{details.title}</h1>
            <p className="text-gray-600">{details.description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
          {formType == 'signup' && <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : details.buttonText}
            </button>
          </form>
          {formType == "login" && <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>}
          <p className="mt-8 text-sm text-gray-600 text-center">
            {details.span}
            <Link href={details.href} className="font-medium text-blue-600 hover:text-blue-500">
              {details.anchor}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;