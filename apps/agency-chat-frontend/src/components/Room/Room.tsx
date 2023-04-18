import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import type { JoinRoomReturn } from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      // TODO: handle failure
      MessageClient.emit(
        CLIENT_MESSAGES.JOIN_ROOM,
        roomId,
        (isSuccess: JoinRoomReturn) => {
          //
        }
      );
    }
  }, [roomId]);

  return <h1>{roomId}</h1>;
}

export default Room;
