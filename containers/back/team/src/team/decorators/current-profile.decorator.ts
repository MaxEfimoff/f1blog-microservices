import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Profile } from '../schemas/profile.schema';

export const CurrentProfile = createParamDecorator(
  async (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    try {
      const user = request.user.id;
      const profile = await Profile.findOne({ user_id: user });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      request.profile = profile;

      return request.profile;
    } catch (err) {
      throw new NotFoundException('User not found');
    }
  },
);
