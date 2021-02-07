import { Publisher, BlogPostUpdatedEvent, Subjects } from '@f1blog/common';

export class BlogPostpdatedPublisher extends Publisher<BlogPostUpdatedEvent> {
  subject: Subjects.BlogPostUpdated = Subjects.BlogPostUpdated;
}
