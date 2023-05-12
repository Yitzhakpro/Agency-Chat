import { useEffect, useRef, useState } from 'react';
import { CLIENT_MESSAGES, EXCEPTIONS, SERVER_MESSAGES } from '@agency-chat/shared/constants';
import { Text, ScrollArea, Box, Center } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MessageClient } from '../../services';
import MessageItem from '../MessageItem';
import SendMessageInput from '../SendMessageInput';
import SystemMessageItem from '../SystemMessageItem';
import type { StatusReturn, Message, WsErrorObject } from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesViewport = useRef<HTMLDivElement>(null);
  const readyToLeave = useRef(false);

  const onMessageRecv = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    if (roomId) {
      MessageClient.emit(CLIENT_MESSAGES.IS_CONNECTED_TO_ROOM, roomId, (status: StatusReturn) => {
        const { success, message } = status;

        if (!success) {
          toast(message, { type: 'error' });
          navigate('/404');
        }
      });
    }
  }, [navigate, roomId]);

  useEffect(() => {
    MessageClient.on(SERVER_MESSAGES.MESSAGE_SENT, onMessageRecv);

    return () => {
      MessageClient.off(SERVER_MESSAGES.MESSAGE_SENT, onMessageRecv);
    };
  }, []);

  // scrolling to bottom of chat in each new message
  useEffect(() => {
    if (messagesViewport.current) {
      messagesViewport.current.scrollTo({
        top: messagesViewport.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // handle command / message errors
  useEffect(() => {
    function handleException(errorObj: WsErrorObject) {
      const { type, message } = errorObj;

      if (type === EXCEPTIONS.COMMAND_ERROR || type === EXCEPTIONS.MESSAGE_ERROR) {
        toast(message, { type: 'error' });
      }
    }

    MessageClient.on('exception', handleException);

    return () => {
      MessageClient.off('exception', handleException);
    };
  });

  // handle command results
  useEffect(() => {
    function handleGotKicked() {
      toast('You got kicked from this room!', { type: 'error' });
      navigate('/rooms');
    }

    function handleGotMuted(time: number) {
      toast(`You got muted for ${time} seconds.`, { type: 'error' });
    }

    function handleGotBanned(time: number) {
      toast(`You got banned for ${time} seconds.`, { type: 'error' });
      navigate('/');
    }

    MessageClient.on(SERVER_MESSAGES.GOT_KICKED, handleGotKicked);
    MessageClient.on(SERVER_MESSAGES.GOT_MUTED, handleGotMuted);
    MessageClient.on(SERVER_MESSAGES.GOT_BANNED, handleGotBanned);

    return () => {
      MessageClient.off(SERVER_MESSAGES.GOT_KICKED, handleGotKicked);
      MessageClient.off(SERVER_MESSAGES.GOT_MUTED, handleGotMuted);
      MessageClient.off(SERVER_MESSAGES.GOT_BANNED, handleGotBanned);
    };
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (readyToLeave.current) {
        MessageClient.emit(CLIENT_MESSAGES.LEAVE_ROOM);
      } else {
        readyToLeave.current = true;
      }
    };
  }, []);

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Center>
        <Text>Room: {roomId}</Text>
      </Center>

      <ScrollArea style={{ height: '100%' }} mt="sm" viewportRef={messagesViewport}>
        {messages.map((msg) => {
          const { id, type, username, role, text, timestamp } = msg;

          if (type === 'message') {
            return (
              <MessageItem
                key={id}
                id={id}
                username={username}
                role={role}
                text={text}
                timestamp={timestamp}
              />
            );
          } else {
            return <SystemMessageItem key={id} id={id} text={text} />;
          }
        })}
      </ScrollArea>

      <SendMessageInput />
    </Box>
  );
}

export default Room;
