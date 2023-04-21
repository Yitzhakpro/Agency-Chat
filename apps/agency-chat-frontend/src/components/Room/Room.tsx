import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CLIENT_MESSAGES,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import type { StatusReturn, Message } from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const connected = useRef(false);

  useEffect(() => {
    if (roomId && !connected.current) {
      MessageClient.emit(
        CLIENT_MESSAGES.IS_CONNECTED_TO_ROOM,
        roomId,
        (status: StatusReturn) => {
          const { success, message } = status;

          if (success) {
            // TODO: rethink
            connected.current = true;
          } else {
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

  // TODO: indicate failure of sending
  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    MessageClient.emit(CLIENT_MESSAGES.SEND_MESSAGE, message);
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
