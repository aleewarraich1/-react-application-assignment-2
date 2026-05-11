import { createContext, useContext } from 'react';

export interface ToastContextType {
  showToast: (message: string, type?: string) => void;
}

export interface ThemeContextType {
  isLight: boolean;
  toggleTheme: () => void;
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });
export const ThemeContext = createContext<ThemeContextType>({ isLight: false, toggleTheme: () => {} });

export const useToast = () => useContext(ToastContext);
export const useTheme = () => useContext(ThemeContext);
