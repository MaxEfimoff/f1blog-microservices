import { Publisher, NewsItemCreatedEvent, Subjects } from '@f1blog/common';

export class NewsItemCreatedPublisher extends Publisher<NewsItemCreatedEvent> {
  subject: Subjects.NewsItemCreated = Subjects.NewsItemCreated;
}
