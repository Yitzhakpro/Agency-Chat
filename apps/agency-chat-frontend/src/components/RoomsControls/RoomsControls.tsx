import { Button, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import CreateRoomModal from '../CreateRoomModal';

interface IRoomsControlsProps {
  onRefresh: () => void;
}

function RoomsControls(props: IRoomsControlsProps): JSX.Element {
  const { onRefresh } = props;

  const [
    createRoomOpened,
    { open: openCreateRoomModal, close: closeCreateRoomModal },
  ] = useDisclosure(false);

  const handleOpenCreateRoomModal = (): void => {
    openCreateRoomModal();
  };

  return (
    <Container
      style={{ display: 'flex', flexDirection: 'row' }}
      size="sm"
      p={0}
    >
      <Button
        style={{ flex: 1 }}
        variant="default"
        onClick={handleOpenCreateRoomModal}
      >
        Create
      </Button>
      <Button style={{ flex: 1 }} variant="default" onClick={onRefresh}>
        Refresh
      </Button>

      <CreateRoomModal isOpen={createRoomOpened} close={closeCreateRoomModal} />
    </Container>
  );
}

export default RoomsControls;
