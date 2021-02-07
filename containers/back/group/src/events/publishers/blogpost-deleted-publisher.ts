import { Publisher, BlogPostDeletedEvent, Subjects } from '@f1blog/common';

export class BlogPostDeletedPublisher extends Publisher<BlogPostDeletedEvent> {
  subject: Subjects.BlogPostDeleted = Subjects.BlogPostDeleted;
}
