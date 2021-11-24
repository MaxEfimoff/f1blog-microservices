import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team, TeamSchema } from './schemas/team.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  providers: [TeamService],
  controllers: [TeamController],
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [TeamService],
})
export class TeamModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
