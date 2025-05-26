import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store/store';
import { setTheme, toggleTheme } from '@/store/Slice/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = () => dispatch(toggleTheme());
  const setMode = (theme: 'light' | 'dark') => dispatch(setTheme(theme));

  return {
    theme: theme,
    toggle,
    setTheme: setMode,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};