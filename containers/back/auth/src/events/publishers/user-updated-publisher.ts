import { Publisher, UserUpdatedEvent, Subjects } from '@f1blog/common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
