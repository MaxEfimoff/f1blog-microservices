import { Publisher, NewsItemUpdatedEvent, Subjects } from '@f1blog/common';

export class NewsItemUpdatedPublisher extends Publisher<NewsItemUpdatedEvent> {
  subject: Subjects.NewsItemUpdated = Subjects.NewsItemUpdated;
}
