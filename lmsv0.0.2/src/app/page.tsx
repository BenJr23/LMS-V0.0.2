'use client';

import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Student' | 'Teacher' | 'Admin'>('Student');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [focused, setFocused] = useState({ email: false, password: false });

  const roles: ('Student' | 'Teacher' | 'Admin')[] = ['Student', 'Teacher', 'Admin'];

  const emailRegex = /^[a-zA-Z0-9._%+-]{3,40}@[a-zA-Z0-9.-]+\.(com)$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,14}$/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);

  const roleClasses = (r: string) =>
    `px-4 py-2 rounded-md ${role === r
      ? 'bg-red-700 text-white'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }`;

  const inputClass = (isValid: boolean, fieldTouched: boolean, value: string, isFocused: boolean) => {
    if (isFocused && value === '') {
      return 'w-full h-10 pl-10 pr-4 border rounded-md placeholder-gray-400 text-gray-800 border-gray-400 focus:ring-2 focus:ring-gray-300';
    }

    return `w-full h-10 pl-10 pr-4 border rounded-md placeholder-gray-400 text-gray-800 focus:outline-none transition-all duration-200 ${fieldTouched && value !== ''
      ? isValid
        ? 'border-green-500 focus:ring-2 focus:ring-green-300'
        : 'border-red-500 focus:ring-2 focus:ring-red-300'
      : 'border-gray-300 focus:ring-2 focus:ring-gray-300'
      }`;
  };

  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: 'url(/assets/sis_bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <Image src="/favicon.ico" alt="Favicon" width={120} height={120} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-red-800">Learning Management System</h1>
          <p className="text-gray-600 text-sm">Sign in to access your account</p>
        </div>

        <div className="flex justify-center space-x-2">
          {roles.map((r) => (
            <button
              key={r}
              className={roleClasses(r)}
              onClick={() => setRole(r)}
              type="button"
            >
              {r}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          if (role === 'Student' && isEmailValid && isPasswordValid) {
            router.push('/student-dashboard');
          }
        }}>
          {/* Email Field */}
          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail className="text-gray-500" size={18} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                className={inputClass(isEmailValid, touched.email, email, focused.email)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setFocused((prev) => ({ ...prev, email: false }));
                }}
                onFocus={() => setFocused((prev) => ({ ...prev, email: true }))}
                autoComplete="off"
              />
            </div>
            <div className="min-h-[1rem]">
              {touched.email && email !== '' && !isEmailValid && (
                <p className="text-[10px] text-red-600 mt-1">
                  Email must be 3–40 characters followed by @domain.com (e.g., user@domain.com)
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Lock className="text-gray-500" size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                className={inputClass(isPasswordValid, touched.password, password, focused.password)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setFocused((prev) => ({ ...prev, password: false }));
                }}
                onFocus={() => setFocused((prev) => ({ ...prev, password: true }))}
                autoComplete="off"
              />
            </div>
            <div className="min-h-[1rem]">
              {touched.password && password !== '' && !isPasswordValid && (
                <p className="text-[10px] text-red-600 mt-1">
                  Password must be 8–14 chars with 1 uppercase, 1 lowercase, 1 digit, 1 special character.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-1 text-gray-700">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-gray-700 hover:underline font-medium">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={!isEmailValid || !isPasswordValid}
            className={`w-full py-2 rounded-md transition ${!isEmailValid || !isPasswordValid
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-red-700 text-white hover:bg-red-800'
              }`}
          >
            Sign in as {role}
          </button>
        </form>
      </div>
    </div>
  );
}