import { Publisher, UserCreatedEvent, Subjects } from '@f1blog/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
