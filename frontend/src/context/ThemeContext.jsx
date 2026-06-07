import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    bg: isDark ? '#0f0f1a' : '#f0f2f5',
    card: isDark ? '#1a1a2e' : '#ffffff',
    text: isDark ? '#ffffff' : '#1a1a2e',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    input: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    inputBorder: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    navBg: isDark ? '#1a1a2e' : '#ffffff',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);