import { Publisher, BlogPostpdatedEvent, Subjects } from '@f1blog/common';

export class BlogPostpdatedPublisher extends Publisher<BlogPostpdatedEvent> {
  subject: Subjects.BlogPostpdated = Subjects.BlogPostpdated;
}
