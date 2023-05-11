import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import type { INestApplicationContext } from '@nestjs/common';

export class SocketIOAdapter extends IoAdapter {
	constructor(
		private readonly app: INestApplicationContext,
		private readonly configService: ConfigService
	) {
		super(app);
	}

	override createIOServer(port: number, options: ServerOptions) {
		const corsConfig = this.configService.get<ServerOptions['cors']>('corsConfig');

		const fullOptions: ServerOptions = {
			...options,
			cors: corsConfig,
		};

		return super.createIOServer(port, fullOptions);
	}
}
