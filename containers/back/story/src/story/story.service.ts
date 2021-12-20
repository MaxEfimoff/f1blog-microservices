import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Story,
  StoryDoc,
  ThreadAttrs,
  CommentAttrs,
} from './schemas/story.schema';
import { Profile, ProfileDoc } from './schemas/profile.schema';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { natsWrapper } from '../nats-wrapper';
import { Team, TeamDoc } from './schemas/team.schema';
import { CreateStoryThreadDto } from './dto/create-story-thread.dto';
import { UpdateStoryThreadDto } from './dto/update-story-thread.dto';
import { CreateStoryThreadCommentDto } from './dto/create-story-thread-comment.dto';
import { UpdateStoryThreadCommentDto } from './dto/update-story-thread-comment.dto';

@Injectable()
export class StoryService {
  async getAllTeams(): Promise<TeamDoc[]> {
    const teams: TeamDoc[] = await Team.find();

    if (!teams) {
      throw new NotFoundException('There are no teams');
    }

    return teams;
  }

  async createStory(
    storyDto: CreateStoryDto,
    profile: ProfileDoc,
    team_id: string,
  ): Promise<StoryDoc> {
    console.log(team_id);
    const team: TeamDoc = await Team.findById(team_id);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    const story: StoryDoc = Story.build({ profile: profile, ...storyDto });

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async getAllStoriesInTeam(team_id: string): Promise<StoryDoc[]> {
    const team: TeamDoc = await Team.findById(team_id);

    if (!team) {
      throw new NotFoundException('You shoukd create team first');
    }

    const stories: StoryDoc[] = await Story.find({ team });

    if (!stories) {
      throw new NotFoundException('There are no stories');
    }

    return stories;
  }

  async getProfiles(): Promise<ProfileDoc[]> {
    const profiles = await Profile.find();

    if (!profiles) {
      throw new NotFoundException('There are no profiles in this team');
    }

    return profiles;
  }

  async getMyStories(profile: ProfileDoc): Promise<StoryDoc[]> {
    const stories: StoryDoc[] = profile.myStories;

    if (!stories) {
      throw new NotFoundException('You should create story first');
    }

    return stories;
  }

  async getStoryById(id: string): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    return story;
  }

  async updateStory(
    storyDto: UpdateStoryDto,
    id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    if (story.profile !== profile) {
      throw new BadRequestException('Only author can update his stories');
    }

    Object.assign(story, storyDto);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async deleteStory(id: string, profile: ProfileDoc): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    if (story.profile !== profile) {
      throw new BadRequestException('Only author can delete his stories');
    }

    const deletedStory: StoryDoc = await Story.findByIdAndRemove(id);

    return deletedStory;
  }

  async getProfileAllStories(profile_id: string): Promise<StoryDoc[]> {
    const profile: ProfileDoc = await Profile.findById(profile_id);

    if (!Profile) {
      throw new NotFoundException('Such profile does not exist');
    }

    const stories: StoryDoc[] = profile.myStories;

    return stories;
  }

  async likeStory(id: string, profile: ProfileDoc): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    if (
      story.likes.filter((like) => like.toString() === profile.id).length > 0
    ) {
      throw new BadRequestException('You already liked this story');
    }

    story.likes.unshift(profile);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async unlikeStory(id: string, profile: ProfileDoc): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    if (
      story.likes.filter((like) => like.toString() === profile.id).length === 0
    ) {
      throw new BadRequestException('You have not liked this story');
    }

    const removeIndex = story.likes
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    story.likes.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save news item to DB');
    });

    return story;
  }

  async dislikeStory(id: string, profile: ProfileDoc): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    if (
      story.dislikes.filter((dislike) => dislike.toString() === profile.id)
        .length > 0
    ) {
      throw new BadRequestException('You already disliked this story');
    }

    story.dislikes.unshift(profile);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async undislikeStory(id: string, profile: ProfileDoc): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    if (
      story.dislikes.filter((dislike) => dislike.toString() === profile.id)
        .length === 0
    ) {
      throw new BadRequestException('You have not disliked this story');
    }

    const removeIndex = story.dislikes
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    story.dislikes.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save news item to DB');
    });

    return story;
  }

  async createStoryThread(
    id: string,
    profile: ProfileDoc,
    storyThreadDto: CreateStoryThreadDto,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const storyThread: ThreadAttrs = { profile, ...storyThreadDto };
    story.threads.push(storyThread);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async updateStoryThread(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
    storyThreadDto: UpdateStoryThreadDto,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    if (thread.profile !== profile) {
      throw new BadRequestException('Only author can update his threads');
    }

    Object.assign(thread, storyThreadDto);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async deleteStoryThread(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    if (thread.profile !== profile) {
      throw new BadRequestException('Only author can delete his threads');
    }

    const removeIndex = story.threads
      .map((item) => item._id.toString())
      .indexOf(thread._id);

    story.threads.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async likeStoryThread(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    if (
      thread.likes.filter((like) => like.toString() === profile.id).length > 0
    ) {
      throw new BadRequestException('You already liked this thread');
    }

    thread.likes.unshift(profile);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async unlikeStoryThread(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    if (
      thread.likes.filter((like) => like.toString() === profile.id).length === 0
    ) {
      throw new BadRequestException('You have not liked this thread');
    }

    const removeIndex = thread.likes
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    thread.likes.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async dislikeStoryThread(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    if (
      thread.dislikes.filter((dislike) => dislike.toString() === profile.id)
        .length > 0
    ) {
      throw new BadRequestException('You already disliked this thread');
    }

    thread.dislikes.unshift(profile);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async undislikeStoryThread(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    if (
      thread.dislikes.filter((dislike) => dislike.toString() === profile.id)
        .length === 0
    ) {
      throw new BadRequestException('You have not disliked this thread');
    }

    const removeIndex = thread.dislikes
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    thread.dislikes.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async createStoryThreadComment(
    id: string,
    thread_id: string,
    profile: ProfileDoc,
    storyThreadCommentDto: CreateStoryThreadCommentDto,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const storyThreadComment: CommentAttrs = {
      profile,
      ...storyThreadCommentDto,
    };
    thread.comments.push(storyThreadComment);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async updateStoryThreadComment(
    id: string,
    thread_id: string,
    comment_id: string,
    profile: ProfileDoc,
    storyThreadCommentDto: UpdateStoryThreadCommentDto,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const comment = thread.comments.filter(
      (comment) => comment._id === comment_id,
    )[0];

    if (!comment) {
      throw new NotFoundException('You should create comment first');
    }

    if (comment.profile !== profile) {
      throw new BadRequestException('Only author can update his comments');
    }

    Object.assign(comment, storyThreadCommentDto);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async deleteStoryThreadComment(
    id: string,
    thread_id: string,
    comment_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const comment = thread.comments.filter(
      (comment) => comment._id === comment_id,
    )[0];

    if (!comment) {
      throw new NotFoundException('You should create comment first');
    }

    if (comment.profile !== profile) {
      throw new BadRequestException('Only author can update his comments');
    }

    const removeIndex = thread.comments
      .map((item) => item._id.toString())
      .indexOf(comment._id);

    thread.comments.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async likeStoryThreadComment(
    id: string,
    thread_id: string,
    comment_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const comment = thread.comments.filter(
      (comment) => comment._id === comment_id,
    )[0];

    if (!comment) {
      throw new NotFoundException('You should create comment first');
    }

    if (
      comment.likes.filter((like) => like.toString() === profile.id).length > 0
    ) {
      throw new BadRequestException('You already liked this comment');
    }

    comment.likes.unshift(profile);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async unlikeStoryThreadComment(
    id: string,
    thread_id: string,
    comment_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const comment = thread.comments.filter(
      (comment) => comment._id === comment_id,
    )[0];

    if (!comment) {
      throw new NotFoundException('You should create comment first');
    }

    if (
      comment.likes.filter((like) => like.toString() === profile.id).length ===
      0
    ) {
      throw new BadRequestException('You have not liked this comment');
    }

    const removeIndex = comment.likes
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    comment.likes.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async dislikeStoryThreadComment(
    id: string,
    thread_id: string,
    comment_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const comment = thread.comments.filter(
      (comment) => comment._id === comment_id,
    )[0];

    if (!comment) {
      throw new NotFoundException('You should create comment first');
    }

    if (
      comment.dislikes.filter((dislike) => dislike.toString() === profile.id)
        .length > 0
    ) {
      throw new BadRequestException('You already disliked this comment');
    }

    comment.dislikes.unshift(profile);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }

  async undislikeStoryThreadComment(
    id: string,
    thread_id: string,
    comment_id: string,
    profile: ProfileDoc,
  ): Promise<StoryDoc> {
    const story: StoryDoc = await Story.findById(id);

    if (!story) {
      throw new NotFoundException('You should create story first');
    }

    const thread = story.threads.filter(
      (thread) => thread._id === thread_id,
    )[0];

    if (!thread) {
      throw new NotFoundException('You should create thread first');
    }

    const comment = thread.comments.filter(
      (comment) => comment._id === comment_id,
    )[0];

    if (!comment) {
      throw new NotFoundException('You should create comment first');
    }

    if (
      comment.dislikes.filter((dislike) => dislike.toString() === profile.id)
        .length === 0
    ) {
      throw new BadRequestException('You have not disliked this comment');
    }

    const removeIndex = comment.dislikes
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    comment.dislikes.splice(removeIndex, 1);

    await story.save((err) => {
      if (err) throw new BadRequestException('Could not save story to DB');
    });

    return story;
  }
}
