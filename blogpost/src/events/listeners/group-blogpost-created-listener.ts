import { Message } from 'node-nats-streaming';
import { Listener, BlogPostCreatedEvent, Subjects } from '@f1blog/common';
import { queueGroupName } from './queue-group-name';
import { BlogPost } from '../../db/models/Blogpost';
import { Profile } from '../../db/models/Profile';
import { Group } from '../../db/models/Group';

export class BlogPostCreatedListener extends Listener<BlogPostCreatedEvent> {
  subject: Subjects.BlogPostCreated = Subjects.BlogPostCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: BlogPostCreatedEvent['data'], msg: Message) {
    console.log('BlogPost created event data!', data);

    const { id, title, text, image, group_id, version, profile_id } = data;

    const profile = await Profile.findOne({ _id: profile_id });
    const group = await Group.findOne({ _id: group_id });

    const blogPost = BlogPost.build({
      profile,
      title,
      text,
      image,
      group,
      version,
      id,
      createdAt: Date.now(),
    });

    await blogPost.save();

    // After we successfully(!) processed the event inside our listener
    // we have to finish by calling ack() method
    msg.ack();
  }
}
