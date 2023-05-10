import { useState } from 'react';
import { Button, Divider, Input } from '@mantine/core';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { MessageClient } from '../../services';

function SendMessageInput(): JSX.Element {
  const [message, setMessage] = useState('');

  const handleChangeMessage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setMessage(event.target.value);
  };

  // TODO: indicate failure of sending
  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (message.startsWith('/')) {
      // handleSendCommand(message.slice(1));
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
