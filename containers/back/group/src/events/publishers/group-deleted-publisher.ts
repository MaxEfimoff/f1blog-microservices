import { Publisher, GroupDeletedEvent, Subjects } from '@f1blog/common';

export class GroupDeletedPublisher extends Publisher<GroupDeletedEvent> {
  subject: Subjects.GroupDeleted = Subjects.GroupDeleted;
}
