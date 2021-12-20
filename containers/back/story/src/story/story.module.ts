import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { Story, StorySchema } from './schemas/story.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  providers: [StoryService],
  controllers: [StoryController],
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [StoryService],
})
export class StoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
