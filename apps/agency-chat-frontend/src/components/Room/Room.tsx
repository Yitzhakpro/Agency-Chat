import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CLIENT_MESSAGES,
  EXCEPTIONS,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import type {
  StatusReturn,
  Message,
  Command,
  WsErrorObject,
} from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
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

  // handle command errors
  useEffect(() => {
    function handleException(errorObj: WsErrorObject) {
      const { type, message } = errorObj;

      if (type === EXCEPTIONS.COMMAND_ERROR) {
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

    if (commandName in commandsToEvents) {
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

  // TODO: indicate failure of sending
  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (message.startsWith('/')) {
      handleSendCommand(message.slice(1));
    } else {
      MessageClient.emit(CLIENT_MESSAGES.SEND_MESSAGE, message);
    }
    setMessage('');
  };

  return (
    <div>
      <h1>room: {roomId}</h1>

      {messages.map((msg) => {
        const { id, username, role, text, timestamp } = msg;

        return (
          <div key={id}>
            <p>{id}</p>
            <p>{username}</p>
            <p>{role}</p>
            <p>{text}</p>
            <p>{timestamp.toString()}</p>
          </div>
        );
      })}

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Room;
