import { NestFactory } from '@nestjs/core';
import * as mongoose from 'mongoose';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { natsWrapper } from './nats-wrapper';
import { ProfileCreatedListener } from './events/listeners/profile-created-listener';
import { ProfileUpdatedListener } from './events/listeners/profile-updated-listener';
import { ProfileDeletedListener } from './events/listeners/profile-deleted-listener';
import { TeamCreatedListener } from './events/listeners/team-created-listener';
import { TeamUpdatedListener } from './events/listeners/team-updated-listener';
import { TeamDeletedListener } from './events/listeners/team-deleted-listener';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new ProfileCreatedListener(natsWrapper.client).listen();
    new ProfileUpdatedListener(natsWrapper.client).listen();
    new ProfileDeletedListener(natsWrapper.client).listen();
    new TeamCreatedListener(natsWrapper.client).listen();
    new TeamUpdatedListener(natsWrapper.client).listen();
    new TeamDeletedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to DB');
  } catch (err) {
    throw new Error(err);
  }

  const config = new DocumentBuilder()
    .setTitle('story module')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addTag('story')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/story/docs', app, document);

  await app.listen(3000);
};
bootstrap();
