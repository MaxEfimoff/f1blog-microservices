import * as mongoose from 'mongoose';
import { ProfileCreatedListener } from './events/listeners/profile-created-listener';
import { ProfileUpdatedListener } from './events/listeners/profile-updated-listener';
import { ProfileDeletedListener } from './events/listeners/profile-deleted-listener';
import { natsWrapper } from './nats-wrapper';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

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

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to DB');
  } catch (err) {
    throw new Error(err);
  }

  const config = new DocumentBuilder()
    .setTitle('team module')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addTag('team')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1/team/docs', app, document);

  await app.listen(3000);
};
bootstrap();
