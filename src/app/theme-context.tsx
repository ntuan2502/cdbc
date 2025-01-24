"use client"; // Đảm bảo rằng đây là một component client-side

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Kiểu dữ liệu của context
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>("light");

  // Kiểm tra theme từ localStorage hoặc mặc định là light
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("light");
    }
  }, []);

  // Chuyển đổi theme và lưu vào localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Lưu theme vào localStorage
  };

  // Cập nhật class của <html> thay vì <body>
  useEffect(() => {
    const htmlElement = document.documentElement; // Tham chiếu đến <html> thay vì <body>
    htmlElement.classList.remove("light", "dark");
    htmlElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
