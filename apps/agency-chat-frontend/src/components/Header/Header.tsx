import {
  ActionIcon,
  Group,
  Header as MantineHeader,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon, IconLogout } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';

function Header(): JSX.Element {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { isLoggedIn, username, logout } = useAuth();

  const toggleScheme = (): void => {
    toggleColorScheme();
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
    toast('Logged out successfully!', { type: 'success' });
  };

  return (
    <MantineHeader height={{ base: 50, md: 60 }} p="md">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text weight={700}>Agency Chat</Text>
        </Link>

        <Group spacing="xs">
          {isLoggedIn && (
            <>
              <Text>Welcome back, {username}</Text>
              <ActionIcon variant="outline" size="md" radius="md" onClick={handleLogout}>
                <IconLogout />
              </ActionIcon>
            </>
          )}
          <ActionIcon variant="outline" size="md" radius="md" onClick={toggleScheme}>
            {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
          </ActionIcon>
        </Group>
      </div>
    </MantineHeader>
  );
}

export default Header;
