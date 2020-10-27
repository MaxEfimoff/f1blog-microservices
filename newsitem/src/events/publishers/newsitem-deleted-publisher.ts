import { Publisher, NewsItemDeletedEvent, Subjects } from '@f1blog/common';

export class NewsItemDeletedPublisher extends Publisher<NewsItemDeletedEvent> {
  subject: Subjects.NewsItemDeleted = Subjects.NewsItemDeleted;
}
