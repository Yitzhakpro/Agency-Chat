import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button, Divider, Input } from '@mantine/core';
import {
  CLIENT_MESSAGES,
  SERVER_MESSAGES,
} from '@agency-chat/shared/constants';
import { useAuth } from '../../hooks';
import { MessageClient } from '../../services';
import type { StatusReturn, Command } from '@agency-chat/shared/interfaces';

function SendMessageInput(): JSX.Element {
  const { role } = useAuth();

  const [message, setMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const mutedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setMessage(event.target.value);
  };

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
            toast(message, { type: 'error' });
          }
        }
      );
    }
  };

  // TODO: indicate failure of sending
  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!message) {
      return;
    }

    if (message.startsWith('/')) {
      handleSendCommand(message.slice(1));
    } else {
      MessageClient.emit(CLIENT_MESSAGES.SEND_MESSAGE, message);
    }
    setMessage('');
  };

  // set disabled input on mute
  useEffect(() => {
    function handleGotMuted(time: number): void {
      setIsDisabled(true);
      mutedTimeoutRef.current = setTimeout(() => {
        setIsDisabled(false);
      }, time * 1000);
    }

    MessageClient.on(SERVER_MESSAGES.GOT_MUTED, handleGotMuted);

    return () => {
      MessageClient.off(SERVER_MESSAGES.GOT_MUTED, handleGotMuted);

      if (mutedTimeoutRef.current) {
        clearTimeout(mutedTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      style={{ display: 'flex', flexDirection: 'row' }}
      onSubmit={handleSendMessage}
    >
      <Input
        style={{ flex: 9 }}
        type="text"
        placeholder="Enter your message"
        required
        disabled={isDisabled}
        value={message}
        onChange={handleChangeMessage}
      />
      <Divider orientation="vertical" ml="xs" mr="xs" />
      <Button
        style={{ flex: 1 }}
        variant="light"
        type="submit"
        disabled={isDisabled}
      >
        Send
      </Button>
    </form>
  );
}

export default SendMessageInput;