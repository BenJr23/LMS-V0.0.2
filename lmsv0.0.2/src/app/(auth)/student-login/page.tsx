'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogIn } from 'lucide-react';
import { useSignIn } from '@clerk/nextjs';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!signIn) {
        throw new Error('Sign in not available');
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        toast.success('Login successful!');
        router.push('/student/dashboard');
      } else {
        toast.error('Login failed. Please try again.');
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (isClerkAPIResponseError(error)) {
        toast.error(error.errors[0]?.message || 'Invalid email or password');
        setError(error.errors[0]?.message || 'Invalid email or password');
      } else {
        toast.error('An error occurred during login');
        setError('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white min-width-[360px]">
      <div className="container">
        {/* Main Screen - BG IMAGE */}
        <div
          style={{ backgroundImage: "url('/assets/sis_bg.webp')" }}
          className="h-screen w-screen bg-cover bg-center"
        >
          {/* LOGIN FORM BG */}
          <div className="absolute right-0 w-full md:w-[450px] min-h-screen min-w-[360px] flex items-center justify-center overflow-hidden bg-white/70 backdrop-blur-[20px] backdrop-saturate-[168%] shadow-md m-0 rounded-none flex flex-col bg-clip-border border border-transparent break-words">
            {/* WRAPPER */}
            <div className="flex flex-col items-center w-full px-8">
              {/* HEADER */}
              <div className="flex flex-col items-center justify-center w-full mb-8">
                <Image
                  src="/assets/sjsfi_logo.svg"
                  alt="SJSFI Logo"
                  width={90}
                  height={90}
                  className="mb-4"
                />
                <h1 className="text-3xl text-center text-[#800000] w-full">
                  Student <span className='font-bold'>Login</span>
                </h1>
              </div>

              {/* BODY */}
              <div className="flex flex-col items-center justify-center w-full">
                <p className='text-center text-black text-sm mb-6'>
                  Please enter your credentials to sign in
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[#800000] text-white rounded-md hover:bg-[#600000] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <LogIn size={24} />
                          <span className="text-lg">Sign In</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-8">
                  <p>© 2024 SJSFI. All rights reserved.</p>
                  <p className="mt-1">For technical support, contact your administrator.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
