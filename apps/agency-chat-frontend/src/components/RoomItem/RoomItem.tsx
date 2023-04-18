interface IRoomItemProps {
  roomName: string;
}

function RoomItem(props: IRoomItemProps): JSX.Element {
  const { roomName } = props;

  return (
    <div>
      <h2>{roomName}</h2>
    </div>
  );
}

export default RoomItem;
