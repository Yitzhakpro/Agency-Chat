import { Button, Container } from '@mantine/core';

interface ICreateRoomButtonProps {
  onClick: () => void;
}

function CreateRoomButton(props: ICreateRoomButtonProps): JSX.Element {
  const { onClick } = props;

  return (
    <Container size="sm" p={0}>
      <Button variant="default" fullWidth onClick={onClick}>
        Create Room
      </Button>
    </Container>
  );
}

export default CreateRoomButton;
