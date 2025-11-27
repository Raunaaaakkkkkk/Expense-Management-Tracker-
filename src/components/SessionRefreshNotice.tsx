"use client";

import { signOut } from "next-auth/react";

export default function SessionRefreshNotice() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-3">
        <svg 
          className="w-5 h-5 text-amber-600 mt-0.5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800">
            Permission Changes Require Re-login
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            If you&apos;ve updated a user&apos;s permissions (like &quot;Can View Team Page&quot;), they need to log out and log back in for the changes to take effect.
          </p>
          <button
            onClick={handleLogout}
            className="mt-3 text-sm font-medium text-amber-800 hover:text-amber-900 underline"
          >
            Log out now
          </button>
        </div>
      </div>
    </div>
  );
}
