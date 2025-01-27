"use client"; // Đảm bảo đây là client-side component

import { useTheme } from "@/app/theme-context";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white"
    >
      {theme === "light" ? <span>🌙</span> : <span>🌞</span>}
    </button>
  );
};

export default ThemeToggleButton;
