import { useState } from 'react';
import { CLIENT_MESSAGES } from '@agency-chat/shared/constants';
import { Button, Center, Input, Modal } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MessageClient } from '../../services';
import type { StatusReturn } from '@agency-chat/shared/interfaces';

interface ICreateRoomModalProps {
  isOpen: boolean;
  close: () => void;
}

function CreateRoomModal(props: ICreateRoomModalProps): JSX.Element {
  const { isOpen, close } = props;

  const navigate = useNavigate();

  const [createRoomName, setCreateRoomName] = useState('');

  const handleChangeCreateRoomName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateRoomName(event.target.value);
  };

  const handleCreateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    MessageClient.emit(CLIENT_MESSAGES.CREATE_ROOM, createRoomName, (status: StatusReturn) => {
      const { success, message } = status;

      if (success) {
        navigate(`/room/${createRoomName}`);
      } else {
        toast(`Can't create room: ${createRoomName}, reason: ${message}`, {
          type: 'error',
        });
      }
    });
  };

  return (
    <Modal
      title="Room Creation"
      radius="md"
      size="lg"
      transitionProps={{ transition: 'slide-up' }}
      opened={isOpen}
      onClose={close}
    >
      <form onSubmit={handleCreateRoom}>
        <Input.Wrapper label="Room name" required>
          <Input
            placeholder="Room name"
            required
            value={createRoomName}
            onChange={handleChangeCreateRoomName}
          />
        </Input.Wrapper>
        <Center mt="lg">
          <Button variant="light" type="submit" disabled={createRoomName.length === 0}>
            Create Room
          </Button>
        </Center>
      </form>
    </Modal>
  );
}

export default CreateRoomModal;
