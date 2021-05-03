import { Publisher, GroupUpdatedEvent, Subjects } from '@f1blog/common';

export class GroupUpdatedPublisher extends Publisher<GroupUpdatedEvent> {
  subject: Subjects.GroupUpdated = Subjects.GroupUpdated;
}
