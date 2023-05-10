import { Center, Divider, Text } from '@mantine/core';

interface ISystemMessageItemProps {
  id: string;
  text: string;
}

function SystemMessageItem(props: ISystemMessageItemProps): JSX.Element {
  const { id: _id, text } = props;

  return (
    <>
      <Center>
        <Text>{text}</Text>
      </Center>
      <Divider my="xs" />
    </>
  );
}

export default SystemMessageItem;
