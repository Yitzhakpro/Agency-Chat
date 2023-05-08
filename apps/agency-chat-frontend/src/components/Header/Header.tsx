import { Link } from 'react-router-dom';
import { Header as MantineHeader, Text } from '@mantine/core';

function Header(): JSX.Element {
  return (
    <MantineHeader height={{ base: 50, md: 60 }} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text>Agency Chat</Text>
        </Link>
      </div>
    </MantineHeader>
  );
}

export default Header;
