"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface NavigationClientProps {
  children: React.ReactNode;
  onNavigate?: () => void;
}

export default function NavigationClient({ children, onNavigate }: NavigationClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Close mobile menu when route changes
    if (onNavigate) {
      onNavigate();
    }
  }, [pathname, onNavigate]);

  return <>{children}</>;
}
