import { Box, Center, Text } from '@mantine/core';

function NotFound(): JSX.Element {
  return (
    <Box style={{ height: '100%' }}>
      <Center style={{ height: '100%' }}>
        <Text size="xl">404 - Page Not Found</Text>
      </Center>
    </Box>
  );
}

export default NotFound;
