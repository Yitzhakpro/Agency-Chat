import { useNavigate } from 'react-router-dom';
import { Button, Divider, Paper, Text } from '@mantine/core';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import type { StatusReturn } from '@agency-chat/shared/interfaces';

interface IRoomItemProps {
  roomName: string;
}

function RoomItem(props: IRoomItemProps): JSX.Element {
  const { roomName } = props;

  const navigate = useNavigate();

  const handleJoin = (): void => {
    MessageClient.emit(
      CLIENT_MESSAGES.JOIN_ROOM,
      roomName,
      (status: StatusReturn) => {
        const { success, message } = status;

        if (success) {
          navigate(`/room/${roomName}`);
        } else {
          // TODO: better error visual
          alert(`Can't connect to room: ${roomName}, reason: ${message}`);
        }
      }
    );
  };

  return (
    <Paper
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      shadow="md"
      radius="md"
      p="sm"
      mt="sm"
      mb="sm"
    >
      <Text style={{ flex: 1 }} size="lg" weight={600}>
        {roomName}
      </Text>
      <Divider orientation="vertical" />
      <Button ml="sm" variant="light" onClick={handleJoin}>
        Join
      </Button>
    </Paper>
  );
}

export default RoomItem;
