"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

interface DemoUser {
  email: string;
  role: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("admin@demo.local");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([]);

  useEffect(() => {
    async function fetchDemoUsers() {
      try {
        const res = await fetch("/api/demo-users");
        if (res.ok) {
          const users = await res.json();
          setDemoUsers(users);
        }
      } catch (err) {
        console.error("Failed to fetch demo users:", err);
      }
    }
    fetchDemoUsers();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Invalid email or password. Please try again.");
        } else {
          setError("An error occurred during sign in. Please try again.");
        }
      } else if (res?.ok) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const onDemoUserClick = (user: DemoUser) => {
    setEmail(user.email);
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-md p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-sm text-neutral-500 mb-8 text-center">Sign in to your expense management account</p>
        
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-lg border border-neutral-300 bg-transparent pl-10 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-lg border border-neutral-300 bg-transparent pl-10 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-3 font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign in
          </button>
        </form>
        {demoUsers.length > 0 && (
          <div className="mt-8">
            <p className="text-sm text-center text-neutral-500 mb-4">Or use a demo account:</p>
            <div className="grid grid-cols-2 gap-3">
              {demoUsers.map(user => (
                <button
                  key={user.email}
                  onClick={() => onDemoUserClick(user)}
                  className="p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 text-left"
                >
                  <p className="font-semibold text-sm">{user.role}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
