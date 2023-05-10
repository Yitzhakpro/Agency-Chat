import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text, ScrollArea, Box } from '@mantine/core';
import {
  CLIENT_MESSAGES,
  EXCEPTIONS,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import { useAuth } from '../../hooks';
import SendMessageInput from '../SendMessageInput';
import type {
  StatusReturn,
  Message,
  Command,
  WsErrorObject,
} from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);

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

  const handleSendCommand = (commandText: string) => {
    const commandsToEvents = {
      kick: CLIENT_MESSAGES.KICK,
      mute: CLIENT_MESSAGES.MUTE,
      ban: CLIENT_MESSAGES.BAN,
    };

    const splitCommand = commandText.split(' ');
    const [commandName, ...commandArgs] = splitCommand;

    // TODO: show info on screen
    if (commandName in commandsToEvents && role === 'ADMIN') {
      const commandToSend = commandsToEvents[commandName as Command];

      MessageClient.emit(
        commandToSend,
        ...commandArgs,
        (status: StatusReturn) => {
          const { success, message } = status;
          if (!success) {
            alert(message);
          }
        }
      );
    }
  };

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Text>Room: {roomId}</Text>

      <ScrollArea style={{ height: '100%' }}>
        {messages.map((msg) => {
          const { id, username, role, text, timestamp } = msg;

          return (
            <div style={{ display: 'block' }} key={id}>
              <p>{id}</p>
              <p>{username}</p>
              <p>{role}</p>
              <Text>{text}</Text>
              <p>{timestamp.toString()}</p>
            </div>
          );
        })}
      </ScrollArea>

      <SendMessageInput />
    </Box>
  );
}

export default Room;
