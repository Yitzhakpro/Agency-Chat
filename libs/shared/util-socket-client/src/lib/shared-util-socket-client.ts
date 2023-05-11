import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';

export const createSocketClient = (
	url: string,
	options?: Partial<ManagerOptions & SocketOptions>
): Socket => {
	const socketClient = io(url, options);

	return socketClient;
};
