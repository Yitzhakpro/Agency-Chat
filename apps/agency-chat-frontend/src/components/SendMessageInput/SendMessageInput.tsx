import { useState } from 'react';
import { Button, Divider, Input } from '@mantine/core';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { useAuth } from '../../hooks';
import { MessageClient } from '../../services';
import type { StatusReturn, Command } from '@agency-chat/shared/interfaces';

function SendMessageInput(): JSX.Element {
  const { role } = useAuth();

  const [message, setMessage] = useState('');

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
    <form
      style={{ display: 'flex', flexDirection: 'row' }}
      onSubmit={handleSendMessage}
    >
      <Input
        style={{ flex: 9 }}
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={handleChangeMessage}
      />
      <Divider orientation="vertical" ml="xs" mr="xs" />
      <Button style={{ flex: 1 }} variant="light" type="submit">
        Send
      </Button>
    </form>
  );
}

export default SendMessageInput;
