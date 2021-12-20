import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { CreateStoryThreadDto } from './dto/create-story-thread.dto';
import { UpdateStoryThreadDto } from './dto/update-story-thread.dto';
import { CreateStoryThreadCommentDto } from './dto/create-story-thread-comment.dto';
import { UpdateStoryThreadCommentDto } from './dto/update-story-thread-comment.dto';
import { StoryDoc, Story } from './schemas/story.schema';
import { Profile, ProfileDoc } from './schemas/profile.schema';
import { TeamDoc } from './schemas/team.schema';
import { CurrentProfile } from './decorators/current-profile.decorator';

@ApiTags('Story')
@Controller('/api/v1/story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  // Profile
  @ApiOperation({ summary: 'Profiles fetch' })
  @ApiResponse({ status: 200, type: [Profile] })
  @Get('/profiles/all')
  getProfiles(): Promise<ProfileDoc[]> {
    return this.storyService.getProfiles();
  }

  // Teams
  @ApiOperation({ summary: 'Teams fetch' })
  @ApiResponse({ status: 200, type: [Profile] })
  @Get('/teams/all')
  getAllTeams(): Promise<TeamDoc[]> {
    return this.storyService.getAllTeams();
  }

  // Story
  @ApiOperation({ summary: 'Fetch all stories in team' })
  @ApiResponse({ status: 200, type: [Story] })
  @Get('/team/:team_id/')
  getAllStoriesInTeam(@Param('team_id') team_id: string): Promise<StoryDoc[]> {
    return this.storyService.getAllStoriesInTeam(team_id);
  }

  @ApiOperation({ summary: 'Fetch my stories' })
  @ApiResponse({ status: 200, type: [Story] })
  @Get('/my')
  getMyStories(@CurrentProfile() profile: ProfileDoc): Promise<StoryDoc[]> {
    return this.storyService.getMyStories(profile);
  }

  @ApiOperation({ summary: 'Fetch story by id' })
  @ApiResponse({ status: 200, type: Story })
  @Get('/:id')
  getStoryById(@Param('id') id: string): Promise<StoryDoc> {
    return this.storyService.getStoryById(id);
  }

  @ApiOperation({ summary: 'Create story in team' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/team/:team_id/')
  @HttpCode(HttpStatus.CREATED)
  createStory(
    @Body() body: CreateStoryDto,
    @CurrentProfile() profile: ProfileDoc,
    @Param('team_id') team_id: string,
  ): Promise<StoryDoc> {
    return this.storyService.createStory(body, profile, team_id);
  }

  @ApiOperation({ summary: 'Update story' })
  @ApiResponse({ status: 201, type: Story })
  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  updateStory(
    @Body() body: UpdateStoryDto,
    @CurrentProfile() profile: ProfileDoc,
    @Param('id') id: string,
  ): Promise<StoryDoc> {
    return this.storyService.updateStory(body, id, profile);
  }

  @ApiOperation({ summary: 'Delete story' })
  @ApiResponse({ status: 200, type: Story })
  @Delete('/:id')
  deleteStory(
    @CurrentProfile() profile: ProfileDoc,
    @Param('id') id: string,
  ): Promise<StoryDoc> {
    return this.storyService.deleteStory(id, profile);
  }

  @ApiOperation({ summary: "Fetch user's all stories" })
  @ApiResponse({ status: 200, type: [Story] })
  @Get('/profile/:profile_id/all')
  getProfileAllStories(
    @Param('profile_id') profile_id: string,
  ): Promise<StoryDoc[]> {
    return this.storyService.getProfileAllStories(profile_id);
  }

  @ApiOperation({ summary: 'Like story' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/like')
  likeStory(
    @Param('id') id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.likeStory(id, profile);
  }

  @ApiOperation({ summary: 'Unlike story' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/unlike')
  unlikeStory(
    @Param('id') id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.unlikeStory(id, profile);
  }

  @ApiOperation({ summary: 'Dislike story' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/dislike')
  dislikeStory(
    @Param('id') id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.dislikeStory(id, profile);
  }

  @ApiOperation({ summary: 'Undislike story' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/undislike')
  undislikeStory(
    @Param('id') id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.undislikeStory(id, profile);
  }

  // Story thread
  @ApiOperation({ summary: 'Create story thread' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread')
  createStoryThread(
    @Param('id') id: string,
    @CurrentProfile() profile: ProfileDoc,
    @Body() body: CreateStoryThreadDto,
  ): Promise<StoryDoc> {
    return this.storyService.createStoryThread(id, profile, body);
  }

  @ApiOperation({ summary: 'Update story thread' })
  @ApiResponse({ status: 201, type: Story })
  @Patch('/:id/thread/:thread_id')
  updateStoryThread(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
    @Body() body: UpdateStoryThreadDto,
  ): Promise<StoryDoc> {
    return this.storyService.updateStoryThread(id, thread_id, profile, body);
  }

  @ApiOperation({ summary: 'Delete story thread' })
  @ApiResponse({ status: 200, type: Story })
  @Delete('/:id/thread/:thread_id')
  deleteStoryThread(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.deleteStoryThread(id, thread_id, profile);
  }

  @ApiOperation({ summary: 'Like story thread' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/like')
  likeStoryThread(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.likeStoryThread(id, thread_id, profile);
  }

  @ApiOperation({ summary: 'Unlike story thread' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/unlike')
  unlikeStoryThread(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.unlikeStoryThread(id, thread_id, profile);
  }

  @ApiOperation({ summary: 'Dislike story thread' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/dislike')
  dislikeStoryThread(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.dislikeStoryThread(id, thread_id, profile);
  }

  @ApiOperation({ summary: 'Undislike story thread' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/undislike')
  undislikeStoryThread(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.undislikeStoryThread(id, thread_id, profile);
  }

  // Story thread comment
  @ApiOperation({ summary: 'Create story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/comment')
  createStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @CurrentProfile() profile: ProfileDoc,
    @Body() body: CreateStoryThreadCommentDto,
  ): Promise<StoryDoc> {
    return this.storyService.createStoryThreadComment(
      id,
      thread_id,
      profile,
      body,
    );
  }

  @ApiOperation({ summary: 'Update story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Patch('/:id/thread/:thread_id/comment/:comment_id')
  updateStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentProfile() profile: ProfileDoc,
    @Body() body: UpdateStoryThreadCommentDto,
  ): Promise<StoryDoc> {
    return this.storyService.updateStoryThreadComment(
      id,
      thread_id,
      comment_id,
      profile,
      body,
    );
  }

  @ApiOperation({ summary: 'Delete story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Delete('/:id/thread/:thread_id/comment/:comment_id')
  deleteStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.deleteStoryThreadComment(
      id,
      thread_id,
      comment_id,
      profile,
    );
  }

  @ApiOperation({ summary: 'Like story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/comment/:comment_id/like')
  likeStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.likeStoryThreadComment(
      id,
      thread_id,
      comment_id,
      profile,
    );
  }

  @ApiOperation({ summary: 'Unlike story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/comment/:comment_id/unlike')
  unlikeStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.unlikeStoryThreadComment(
      id,
      thread_id,
      comment_id,
      profile,
    );
  }

  @ApiOperation({ summary: 'Dislike story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/comment/:comment_id/dislike')
  dislikeStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.dislikeStoryThreadComment(
      id,
      thread_id,
      comment_id,
      profile,
    );
  }

  @ApiOperation({ summary: 'Undislike story thread comment' })
  @ApiResponse({ status: 201, type: Story })
  @Post('/:id/thread/:thread_id/comment/:comment_id/undislike')
  undislikeStoryThreadComment(
    @Param('id') id: string,
    @Param('thread_id') thread_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentProfile() profile: ProfileDoc,
  ): Promise<StoryDoc> {
    return this.storyService.undislikeStoryThreadComment(
      id,
      thread_id,
      comment_id,
      profile,
    );
  }
}
