import RoomItem from '../RoomItem';

interface IRoomsListProps {
  rooms: string[];
}

function RoomsList(props: IRoomsListProps): JSX.Element {
  const { rooms } = props;

  return (
    <>
      {rooms.map((roomName) => {
        return <RoomItem roomName={roomName} />;
      })}
    </>
  );
}

export default RoomsList;
