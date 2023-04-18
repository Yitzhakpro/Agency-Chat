import { useNavigate } from 'react-router-dom';

interface IRoomItemProps {
  roomName: string;
}

function RoomItem(props: IRoomItemProps): JSX.Element {
  const { roomName } = props;

  const navigate = useNavigate();

  const handleJoin = (): void => {
    navigate(`/room/${roomName}`);
  };

  return (
    <div>
      <h2>{roomName}</h2>
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default RoomItem;
