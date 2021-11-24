import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ProfileDoc, Profile } from './schemas/profile.schema';
import { TeamDoc, Team } from './schemas/team.schema';
import { CurrentProfile } from './decorators/current-profile.decorator';

@ApiTags('Team')
@Controller('/api/v1/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Teams fetch' })
  @ApiResponse({ status: 200, type: Team })
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
    @Param() id: string,
  ) {
    return this.teamService.updateTeam(body, id, profile);
  }

  @ApiOperation({ summary: 'Team fetch' })
  @ApiResponse({ status: 200, type: Team })
  @Get('/:id')
  getTeam(@Param() id: string): Promise<TeamDoc> {
    return this.teamService.getTeamById(id);
  }

  @ApiOperation({ summary: 'Profiles fetch' })
  @ApiResponse({ status: 200, type: [Profile] })
  @Get('/profiles')
  getProfiles(): Promise<ProfileDoc[]> {
    return this.teamService.getProfiles();
  }
}
