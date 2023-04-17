import { useParams } from 'react-router-dom';

function Room(): JSX.Element {
  const { roomId } = useParams();

  return <h1>{roomId}</h1>;
}

export default Room;
