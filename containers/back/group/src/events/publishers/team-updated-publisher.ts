import { Publisher, TeamUpdatedEvent, Subjects } from '@f1blog/common';

export class TeamUpdatedPublisher extends Publisher<TeamUpdatedEvent> {
  subject: Subjects.TeamUpdated = Subjects.TeamUpdated;
}
