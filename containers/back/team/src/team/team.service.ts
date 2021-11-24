import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { BadRequestError } from '@f1blog/common';
import { Team, TeamDoc } from './schemas/team.schema';
import { Profile, ProfileDoc } from './schemas/profile.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamCreatedPublisher } from '../events/publishers/team-created-publisher';
import { TeamUpdatedPublisher } from '../events/publishers/team-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDoc>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDoc>,
  ) {}

  async createTeam(
    teamDto: CreateTeamDto,
    profile: ProfileDoc,
  ): Promise<TeamDoc> {
    const newTeam = Team.build({ profile: profile, ...teamDto });

    await newTeam.save((err) => {
      if (err) throw new BadRequestError('Could not save team to DB');
    });

    new TeamCreatedPublisher(natsWrapper.client).publish({
      id: newTeam.id,
      title: newTeam.title,
      version: newTeam.version,
      profile_id: profile.id,
    });

    return newTeam;
  }

  async updateTeam(
    teamDto: UpdateTeamDto,
    id: string,
    profile: ProfileDoc,
  ): Promise<TeamDoc> {
    const team = await Team.findById(id);

    if (!team) {
      throw new NotFoundError('You should create team first');
    }

    Object.assign(team, teamDto);

    await team.save((err) => {
      if (err) throw new BadRequestError('Could not save news item to DB');
    });

    // Publish a TeamUpdatyed event
    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      version: team.version,
      profile_id: profile.id,
    });

    return team;
  }

  async getTeamById(id: string): Promise<TeamDoc> {
    const team = await Team.findById(id);

    return team;
  }

  async getAllTeams(): Promise<TeamDoc[]> {
    const teams = await Team.find();

    return teams;
  }

  async getProfiles(): Promise<ProfileDoc[]> {
    const teams = await Profile.find().limit(10);

    return teams;
  }
}
