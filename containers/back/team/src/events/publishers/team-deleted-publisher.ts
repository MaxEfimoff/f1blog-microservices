import { Publisher, TeamDeletedEvent, Subjects } from '@f1blog/common';

export class TeamDeletedPublisher extends Publisher<TeamDeletedEvent> {
  subject: Subjects.TeamDeleted = Subjects.TeamDeleted;
}
