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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ProfileDoc, Profile } from './schemas/profile.schema';
import { TeamDoc, Team } from './schemas/team.schema';
import { CurrentProfile } from './decorators/current-profile.decorator';

@ApiTags('Team')
@Controller('/api/v1/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Teams fetch' })
  @ApiResponse({ status: 200, type: [Team] })
  @Get('/')
  getAllTeams(): Promise<TeamDoc[]> {
    return this.teamService.getAllTeams();
  }

  @ApiOperation({ summary: 'Team creation' })
  @ApiResponse({ status: 201, type: Team })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  createTeam(
    @Body() body: CreateTeamDto,
    @CurrentProfile() profile: ProfileDoc,
  ) {
    return this.teamService.createTeam(body, profile);
  }

  @ApiOperation({ summary: 'Team update' })
  @ApiResponse({ status: 201, type: Team })
  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  updateTeam(
    @Body() body: UpdateTeamDto,
    @CurrentProfile() profile: ProfileDoc,
    @Param('id') id: string,
  ) {
    return this.teamService.updateTeam(body, id, profile);
  }

  @ApiOperation({ summary: 'Profiles fetch' })
  @ApiResponse({ status: 200, type: [Profile] })
  @Get('/profiles/all')
  getProfiles(): Promise<ProfileDoc[]> {
    return this.teamService.getProfiles();
  }

  @ApiOperation({ summary: 'Delete team' })
  @ApiResponse({ status: 200, type: Team })
  @Delete('/:id')
  deleteTeam(
    @CurrentProfile() profile: ProfileDoc,
    @Param('id') _id: string,
  ): Promise<TeamDoc> {
    return this.teamService.deleteTeam(_id, profile);
  }

  @ApiOperation({ summary: 'Delete user from team' })
  @ApiResponse({ status: 200, type: Team })
  @Delete('/:id/user/:profileId')
  deleteUserFromTeam(
    @Param('id') _id: string,
    @Param('profileId') profileId: string,
  ): Promise<TeamDoc> {
    return this.teamService.deleteUserFromTeam(_id, profileId);
  }

  @ApiOperation({ summary: 'Get teams created by me' })
  @ApiResponse({ status: 200, type: Team })
  @Get('/my-teams/all')
  getMyTeams(@CurrentProfile() profile: ProfileDoc) {
    return this.teamService.getMyTeams(profile);
  }

  @ApiOperation({ summary: 'Get joined teams' })
  @ApiResponse({ status: 200, type: Team })
  @Get('/joined-teams/all')
  getJoinedTeams(@CurrentProfile() profile: ProfileDoc) {
    return this.teamService.getMyTeams(profile);
  }

  @ApiOperation({ summary: 'Find team by title' })
  @ApiResponse({ status: 200, type: Team })
  @Get('/:title/title')
  getTeamByTitle(@Param('title') title: string): Promise<TeamDoc> {
    return this.teamService.getTeamByTitle(title);
  }

  @ApiOperation({ summary: 'Find all profiles in team' })
  @ApiResponse({ status: 200, type: [Profile] })
  @Get('/:id/members')
  getTeamMembers(@Param('id') _id: string) {
    return this.teamService.getTeamMembers(_id);
  }

  @ApiOperation({ summary: 'Join the team' })
  @ApiResponse({ status: 201, type: Team })
  @Post('/:id/join')
  joinTeam(@Param('id') _id: string, @CurrentProfile() profile: ProfileDoc) {
    return this.teamService.joinTeam(_id, profile);
  }

  @ApiOperation({ summary: 'Leave the team' })
  @ApiResponse({ status: 201, type: Team })
  @Post('/:id/leave')
  leaveTeam(@Param('id') _id: string, @CurrentProfile() profile: ProfileDoc) {
    return this.teamService.leaveTeam(_id, profile);
  }

  @ApiOperation({ summary: 'Team fetch' })
  @ApiResponse({ status: 200, type: Team })
  @Get('/:id')
  getTeam(@Param('id') _id: string): Promise<TeamDoc> {
    return this.teamService.getTeamById(_id);
  }
}
