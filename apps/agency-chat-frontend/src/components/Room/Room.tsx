import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, ScrollArea, Box } from '@mantine/core';
import {
  CLIENT_MESSAGES,
  EXCEPTIONS,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import MessageItem from '../MessageItem';
import SendMessageInput from '../SendMessageInput';
import type {
  StatusReturn,
  Message,
  WsErrorObject,
} from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesViewport = useRef<HTMLDivElement>(null);
  const readyToLeave = useRef(false);

  useEffect(() => {
    if (roomId) {
      MessageClient.emit(
        CLIENT_MESSAGES.IS_CONNECTED_TO_ROOM,
        roomId,
        (status: StatusReturn) => {
          const { success, message } = status;

          if (!success) {
            alert(`Cant connect to this room, reason: ${message}`);
            navigate('/rooms');
          }
        }
      );
    }
  }, [navigate, roomId]);

  useEffect(() => {
    // ?: think about moving it outside
    function updateMessages(msg: Message) {
      setMessages((prevMessages) => [...prevMessages, msg]);
      if (messagesViewport.current) {
        messagesViewport.current.scrollTo({
          top: messagesViewport.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }

    MessageClient.on(SERVER_MESSAGES.MESSAGE_SENT, updateMessages);

    return () => {
      MessageClient.off(SERVER_MESSAGES.MESSAGE_SENT, updateMessages);
    };
  }, []);

  // handle command / message errors
  useEffect(() => {
    function handleException(errorObj: WsErrorObject) {
      const { type, message } = errorObj;

      if (
        type === EXCEPTIONS.COMMAND_ERROR ||
        type === EXCEPTIONS.MESSAGE_ERROR
      ) {
        alert(message);
      }
    }

    MessageClient.on('exception', handleException);

    return () => {
      MessageClient.off('exception', handleException);
    };
  });

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
      <Text>Room: {roomId}</Text>

      <ScrollArea
        style={{ height: '100%' }}
        viewportRef={messagesViewport}
      >
        {messages.map((msg) => {
          const { id, type, username, role, text, timestamp } = msg;

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
        })}
      </ScrollArea>

      <SendMessageInput />
    </Box>
  );
}

export default Room;
