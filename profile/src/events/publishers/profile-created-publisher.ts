import { Publisher, ProfileCreatedEvent, Subjects } from '@f1blog/common';

export class ProfileCreatedPublisher extends Publisher<ProfileCreatedEvent> {
  subject: Subjects.ProfileCreated = Subjects.ProfileCreated;
}
