import { SocketIOAdapter } from '@agency-chat/agency-chat-backend/util';
import fastifyCookie from '@fastify/cookie';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import type { CorsOptions } from './config';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	const configService = app.get(ConfigService);
	const port = configService.get<number>('port');
	const corsOptions = configService.get<CorsOptions>('corsConfig');

	app.enableCors(corsOptions);

	await app.register(fastifyCookie);

	const globalPrefix = 'api';
	app.setGlobalPrefix(globalPrefix);

	app.useGlobalPipes(new ValidationPipe());

	app.enableVersioning({
		type: VersioningType.URI,
	});

	app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

	if (process.env.NODE_ENV !== 'production') {
		const config = new DocumentBuilder()
			.setTitle('Agency Chat Backend')
			.setDescription('Agency Chat API Routes')
			.setVersion('1.0')
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('swagger', app, document);
	}

	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
