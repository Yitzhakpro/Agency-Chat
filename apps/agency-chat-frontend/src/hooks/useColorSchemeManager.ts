import { useState } from 'react';
import type { ColorScheme } from '@mantine/core';

function useColorSchemeManager() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    (localStorage.getItem('theme') as ColorScheme) || 'light'
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const newScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', newScheme);
    setColorScheme(newScheme);
  };

  return { colorScheme, toggleColorScheme };
}

export default useColorSchemeManager;
