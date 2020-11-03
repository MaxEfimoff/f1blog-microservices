import { Publisher, ProfileDeletedEvent, Subjects } from '@f1blog/common';

export class ProfileDeletedPublisher extends Publisher<ProfileDeletedEvent> {
  subject: Subjects.ProfileDeleted = Subjects.ProfileDeleted;
}
