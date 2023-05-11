import { useEffect, useState } from 'react';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { Affix, Button, Transition, rem } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';
import { MessageClient } from '../../services';
import RoomsControls from '../RoomsControls';
import RoomsList from '../RoomsList';
import type { GetRoomsReturn } from '@agency-chat/shared/interfaces';

function RoomsPage(): JSX.Element {
  const [scroll, scrollTo] = useWindowScroll();

  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = (): void => {
    MessageClient.emit(
      CLIENT_MESSAGES.GET_ROOMS,
      (returnedRooms: GetRoomsReturn) => {
        setRooms(returnedRooms);
      }
    );
  };

  const scrollToTop = (): void => {
    scrollTo({ y: 0 });
  };

  return (
    <>
      <RoomsControls onRefresh={getRooms} />

      <RoomsList rooms={rooms} />

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
