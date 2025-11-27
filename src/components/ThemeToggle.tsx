"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemPrefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system preference changes when theme is "system"
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleThemeChange("light")}
        className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${theme === "light" ? "bg-neutral-200 dark:bg-neutral-700" : ""}`}
        title="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${theme === "dark" ? "bg-neutral-200 dark:bg-neutral-700" : ""}`}
        title="Dark mode"
      >
        🌙
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={`p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${theme === "system" ? "bg-neutral-200 dark:bg-neutral-700" : ""}`}
        title="System preference"
      >
        💻
      </button>
    </div>
  );
}
