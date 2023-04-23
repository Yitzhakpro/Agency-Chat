import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import RoomsList from '../RoomsList';
import type {
  GetRoomsReturn,
  StatusReturn,
} from '@agency-chat/shared/interfaces';

function RoomsPage(): JSX.Element {
  const navigate = useNavigate();

  const [createRoomName, setCreateRoomName] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    MessageClient.emit(
      CLIENT_MESSAGES.GET_ROOMS,
      (returnedRooms: GetRoomsReturn) => {
        setRooms(returnedRooms);
      }
    );
  }, []);

  const handleCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    MessageClient.emit(
      CLIENT_MESSAGES.CREATE_ROOM,
      createRoomName,
      (status: StatusReturn) => {
        const { success, message } = status;

        if (success) {
          navigate(`/room/${createRoomName}`);
        } else {
          // TODO: better error visual
          alert(`Can't create room: ${createRoomName}, reason: ${message}`);
        }
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          placeholder="create-room-name"
          value={createRoomName}
          onChange={(e) => setCreateRoomName(e.target.value)}
        />
        <button type="submit">create</button>
      </form>
      <RoomsList rooms={rooms} />
    </div>
  );
}

export default RoomsPage;
