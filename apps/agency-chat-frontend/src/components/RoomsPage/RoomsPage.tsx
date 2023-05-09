import { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import CreateRoomModal from '../CreateRoomModal';
import RoomsList from '../RoomsList';
import type { GetRoomsReturn } from '@agency-chat/shared/interfaces';

function RoomsPage(): JSX.Element {
  const [
    createRoomOpened,
    { open: openCreateRoomModal, close: closeCreateRoomModal },
  ] = useDisclosure(false);

  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    MessageClient.emit(
      CLIENT_MESSAGES.GET_ROOMS,
      (returnedRooms: GetRoomsReturn) => {
        setRooms(returnedRooms);
      }
    );
  }, []);

  return (
    <>
      <Button onClick={() => openCreateRoomModal()}>create</Button>
      <RoomsList rooms={rooms} />
      <CreateRoomModal isOpen={createRoomOpened} close={closeCreateRoomModal} />
    </>
  );
}

export default RoomsPage;
