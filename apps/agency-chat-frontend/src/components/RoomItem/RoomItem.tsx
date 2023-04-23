import { useNavigate } from 'react-router-dom';
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
    <div>
      <h2>{roomName}</h2>
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default RoomItem;
