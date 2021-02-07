import { Publisher, FetchAllNewsItemsEvent, Subjects } from '@f1blog/common';

export class FetchAllNewsItemsPublisher extends Publisher<
  FetchAllNewsItemsEvent
> {
  subject: Subjects.FetchAllNewsItems = Subjects.FetchAllNewsItems;
}
