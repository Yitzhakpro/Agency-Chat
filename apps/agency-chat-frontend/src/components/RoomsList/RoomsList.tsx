import { Container } from '@mantine/core';
import RoomItem from '../RoomItem';

interface IRoomsListProps {
  rooms: string[];
}

function RoomsList(props: IRoomsListProps): JSX.Element {
  const { rooms } = props;

  return (
    <Container size="sm" p={0}>
      {rooms.map((roomName) => {
        return <RoomItem key={roomName} roomName={roomName} />;
      })}
    </Container>
  );
}

export default RoomsList;
