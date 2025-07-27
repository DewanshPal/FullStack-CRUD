import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    console.log('Theme changing to:', darkMode ? 'dark' : 'light');
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Added dark class to root');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Removed dark class from root');
    }
    console.log('Root classes:', root.className);
  }, [darkMode]);

  const toggleDarkMode = () => {
    console.log('Toggle called, current darkMode:', darkMode);
    setDarkMode(prev => {
      console.log('Setting darkMode to:', !prev);
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
