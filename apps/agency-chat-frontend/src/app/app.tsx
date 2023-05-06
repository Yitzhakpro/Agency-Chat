import { Routes, Route } from 'react-router-dom';
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

export function App() {
  return (
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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
