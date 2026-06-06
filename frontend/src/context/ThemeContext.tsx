import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeCtx {
  isLight: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({} as ThemeCtx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('light', isLight);
  }, [isLight]);

  const toggleTheme = () => setIsLight((v) => !v);

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
