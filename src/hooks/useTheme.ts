import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { setTheme, toggleTheme } from '@/store/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const toggle = () => dispatch(toggleTheme());
  const setMode = (theme: 'light' | 'dark') => dispatch(setTheme(theme));

  return {
    theme: mode,
    toggle,
    setTheme: setMode,
    isDark: mode === 'dark',
    isLight: mode === 'light',
  };
};