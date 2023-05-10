import { useNavigate } from 'react-router-dom';
import { Button, Center, Container, Text } from '@mantine/core';

function Homepage(): JSX.Element {
  const navigate = useNavigate();

  const handleGetStarted = (): void => {
    navigate('/rooms');
  };

  return (
    <Center
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Text size="xl">Welcome To Agency Chat!</Text>
      <Container m="md">
        <Button variant="light" onClick={handleGetStarted}>
          Get Started
        </Button>
      </Container>
    </Center>
  );
}

export default Homepage;
