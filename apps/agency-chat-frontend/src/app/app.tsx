import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import {
  Login,
  Register,
  Homepage,
  NotFound,
  Layout,
  ProtectedLayout,
  RoomsPage,
  Room,
} from '../components';
import { AuthProvider } from '../providers';
import type { ColorScheme } from '@mantine/core';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    (localStorage.getItem('theme') as ColorScheme) || 'light'
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const newScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', newScheme);
    setColorScheme(newScheme);
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedLayout />}>
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/room/:roomId" element={<Room />} />
              </Route>
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
        <ToastContainer
          theme={colorScheme === 'dark' ? 'dark' : 'light'}
          position="bottom-right"
        />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
