import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CLIENT_MESSAGES,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';
import type { JoinRoomReturn, Message } from '@agency-chat/shared/interfaces';

function Room(): JSX.Element {
  const { roomId } = useParams();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

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

  useEffect(() => {
    // ?: think about moving it outside
    function updateMessages(msg: Message) {
      setMessages((prevMessages) => [...prevMessages, msg]);
    }

    MessageClient.on(SERVER_MESSAGES.USER_SENT_MESSAGE, updateMessages);

    return () => {
      MessageClient.off(SERVER_MESSAGES.USER_SENT_MESSAGE, updateMessages);
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
          <div>
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
