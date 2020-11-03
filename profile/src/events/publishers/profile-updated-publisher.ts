import { Publisher, ProfileUpdatedEvent, Subjects } from '@f1blog/common';

export class ProfileUpdatedPublisher extends Publisher<ProfileUpdatedEvent> {
  subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;
}
