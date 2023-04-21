import { useNavigate } from 'react-router-dom';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import type { JoinRoomReturn } from '@agency-chat/shared/interfaces';

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
      (isSuccess: JoinRoomReturn) => {
        if (isSuccess) {
          navigate(`/room/${roomName}`);
        } else {
          // TODO: better error visual
          alert(`Can't connect to room: ${roomName}`);
        }
      }
    );
  };

  return (
    <div>
      <h2>{roomName}</h2>
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default RoomItem;
