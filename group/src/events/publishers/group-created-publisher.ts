import { Publisher, GroupCreatedEvent, Subjects } from '@f1blog/common';

export class GroupCreatedPublisher extends Publisher<GroupCreatedEvent> {
  subject: Subjects.GroupCreated = Subjects.GroupCreated;
}
