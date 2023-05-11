import {
  ActionIcon,
  Group,
  Header as MantineHeader,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';

function Header(): JSX.Element {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { isLoggedIn, username } = useAuth();

  const toggleScheme = (): void => {
    toggleColorScheme();
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

        <Group>
          {isLoggedIn && <Text>Welcome back, {username}</Text>}
          <ActionIcon variant="outline" size="md" radius="md" onClick={toggleScheme}>
            {colorScheme === 'dark' ? <IconSun /> : <IconMoon />}
          </ActionIcon>
        </Group>
      </div>
    </MantineHeader>
  );
}

export default Header;
