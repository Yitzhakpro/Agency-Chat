import { Badge, Box, Divider, Text } from '@mantine/core';
import type { Role } from '@agency-chat/shared/interfaces';

interface IMessageItemProps {
  id: string;
  username: string;
  role: Role;
  text: string;
  timestamp: Date;
}

function MessageItem(props: IMessageItemProps): JSX.Element {
  const { id: _id, username, role, text, timestamp: _timestamp } = props;

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text weight={700}>[ {username} ]</Text>
        {role !== 'USER' && (
          <Badge ml="xs" color="red">
            {role}
          </Badge>
        )}
        <Text mr="xs">:</Text>
        {/* TODO: make text wrap to next line */}
        <Text>{text}</Text>
      </Box>
      <Divider my="sm" />
    </>
  );
}

export default MessageItem;
