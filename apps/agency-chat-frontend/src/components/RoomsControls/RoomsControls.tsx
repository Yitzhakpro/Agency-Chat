import { Button, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import CreateRoomModal from '../CreateRoomModal';

interface IRoomsControlsProps {
  onRefresh: () => void;
}

function RoomsControls(props: IRoomsControlsProps): JSX.Element {
  const { onRefresh } = props;

  const [createRoomOpened, { open: openCreateRoomModal, close: closeCreateRoomModal }] =
    useDisclosure(false);

  const handleOpenCreateRoomModal = (): void => {
    openCreateRoomModal();
  };

  return (
    <Container size="sm" p={0}>
      <Group grow spacing="xs">
        <Button variant="default" onClick={handleOpenCreateRoomModal}>
          Create
        </Button>
        <Button variant="default" onClick={onRefresh}>
          Refresh
        </Button>
      </Group>

      <CreateRoomModal isOpen={createRoomOpened} close={closeCreateRoomModal} />
    </Container>
  );
}

export default RoomsControls;
