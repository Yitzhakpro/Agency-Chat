import { useEffect, useState } from 'react';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import RoomsList from '../RoomsList';
import type { GetRoomsReturn } from '@agency-chat/shared/interfaces'

function RoomsPage(): JSX.Element {
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    MessageClient.emit(CLIENT_MESSAGES.GET_ROOMS, (returnedRooms: GetRoomsReturn) => {
      setRooms(returnedRooms);
    });
  }, []);

  return (
    <div>
      <RoomsList rooms={rooms} />
    </div>
  );
}

export default RoomsPage;
