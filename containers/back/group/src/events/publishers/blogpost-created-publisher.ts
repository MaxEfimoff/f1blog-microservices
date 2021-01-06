import { Publisher, BlogPostCreatedEvent, Subjects } from '@f1blog/common';

export class BlogPostCreatedPublisher extends Publisher<BlogPostCreatedEvent> {
  subject: Subjects.BlogPostCreated = Subjects.BlogPostCreated;
}
