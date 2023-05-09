import { useEffect, useState } from 'react';
import { Affix, Button, Transition, rem } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import CreateRoomButton from '../CreateRoomButton';
import CreateRoomModal from '../CreateRoomModal';
import RoomsList from '../RoomsList';
import type { GetRoomsReturn } from '@agency-chat/shared/interfaces';

function RoomsPage(): JSX.Element {
  const [
    createRoomOpened,
    { open: openCreateRoomModal, close: closeCreateRoomModal },
  ] = useDisclosure(false);
  const [scroll, scrollTo] = useWindowScroll();

  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    MessageClient.emit(
      CLIENT_MESSAGES.GET_ROOMS,
      (returnedRooms: GetRoomsReturn) => {
        setRooms(returnedRooms);
      }
    );
  }, []);

  const handleOpenCreateRoomModal = (): void => {
    openCreateRoomModal();
  };

  const scrollToTop = (): void => {
    scrollTo({ y: 0 });
  };

  return (
    <>
      <CreateRoomButton onClick={handleOpenCreateRoomModal} />
      <RoomsList rooms={rooms} />
      <CreateRoomModal isOpen={createRoomOpened} close={closeCreateRoomModal} />

      <Affix position={{ bottom: rem(10), right: rem(10) }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftIcon={<IconArrowUp size="1rem" />}
              variant="light"
              style={transitionStyles}
              onClick={scrollToTop}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
}

export default RoomsPage;
