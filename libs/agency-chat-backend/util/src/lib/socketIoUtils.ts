export const getUserCreatedRooms = (socketIoRooms: Map<string, Set<string>>): string[] => {
	const allRooms = Array.from(socketIoRooms);

	const filteredList = allRooms
		.filter(([roomKey, roomUsers]) => {
			if (roomUsers.size === 1 && roomUsers.has(roomKey)) {
				return false;
			}

			return true;
		})
		.map(([roomKey, _roomUsers]) => {
			return roomKey;
		});

	return filteredList;
};
