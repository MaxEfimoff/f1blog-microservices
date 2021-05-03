import { Publisher, TeamCreatedEvent, Subjects } from '@f1blog/common';

export class TeamCreatedPublisher extends Publisher<TeamCreatedEvent> {
  subject: Subjects.TeamCreated = Subjects.TeamCreated;
}
