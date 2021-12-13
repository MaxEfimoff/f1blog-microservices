import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async createTeam(
    teamDto: CreateTeamDto,
    profile: ProfileDoc,
  ): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findOne({
      title: teamDto.title,
    });

    if (team) {
      throw new BadRequestException('Team with this title already exists');
    }

    const newTeam = Team.build({ profile: profile, ...teamDto });
    newTeam.members.unshift(profile.id);

    await newTeam.save((err) => {
      if (err) throw new BadRequestError('Could not save team to DB');
    });

    new TeamCreatedPublisher(natsWrapper.client).publish({
      id: newTeam.id,
      title: newTeam.title,
      version: newTeam.version,
      profile_id: profile.id,
      members: newTeam.members,
    });

    return newTeam;
  }

  async updateTeam(
    teamDto: UpdateTeamDto,
    id: string,
    profile: ProfileDoc,
  ): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findById(id);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    Object.assign(team, teamDto);

    await team.save((err) => {
      if (err) throw new BadRequestException('Could not save news item to DB');
    });

    // Publish a TeamUpdated event
    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      version: team.version,
      profile_id: profile.id,
    });

    return team;
  }

  async getTeamById(_id: string): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findById(_id);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    return team;
  }

  async getAllTeams(): Promise<TeamDoc[]> {
    const teams: TeamDoc[] = await Team.find();

    if (!teams) {
      throw new NotFoundException('There are no teams');
    }

    return teams;
  }

  async getProfiles(): Promise<ProfileDoc[]> {
    const profiles = await Profile.find();

    if (!profiles) {
      throw new NotFoundException('There are no profiles in this team');
    }

    return profiles;
  }

  async deleteTeam(_id: string, profile: ProfileDoc): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findByIdAndRemove(_id);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    // Publish a TeamUpdated event
    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      version: team.version,
      profile_id: profile.id,
    });

    return team;
  }

  async deleteUserFromTeam(_id: string, profileId: string): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findById(_id);
    const profile: ProfileDoc = await Profile.findById(profileId);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    // Check if user is in members array
    if (
      team.members.filter((member) => member.toString() === profile.id)
        .length === 0
    ) {
      throw new NotFoundException('User is not a member of this team');
    }

    // Get the remove index in Team document
    const removeIndex = team.members
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    // Splice out of Team members array
    team.members.splice(removeIndex, 1);

    // Get the remove index in Profile document
    const removeTeamIndex = profile.joinedTeams
      .map((item) => item._id.toString())
      .indexOf(team.id);

    // Splice out of Profile joinedTeams array
    profile.joinedTeams.splice(removeTeamIndex, 1);

    // Save data to DB
    await team.save((err) => {
      if (err) throw new NotFoundException('Could not save team to DB');
    });

    await profile.save((err) => {
      if (err) throw new NotFoundException('Could not save profile to DB');
    });

    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      members: team.members,
      version: team.version - 1,
      profile_id: profile.id,
    });

    return team;
  }

  async getMyTeams(profile: ProfileDoc): Promise<TeamDoc[]> {
    const teams = profile.myTeams;

    if (!teams) {
      throw new NotFoundException('You should create teams first');
    }

    return teams;
  }

  async getJoinedTeams(profile: ProfileDoc): Promise<TeamDoc[]> {
    const teams = profile.joinedTeams;
    if (!teams) {
      throw new NotFoundException('You should joined teams first');
    }

    return teams;
  }

  async getTeamByTitle(title: string): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findOne({ title: title });

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    return team;
  }

  async joinTeam(_id: string, profile: ProfileDoc): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findById(_id);

    const foundProfile = await Profile.findById(profile._id);

    if (!foundProfile) {
      throw new NotFoundException('You should create profile first!');
    }

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    if (
      team.members.filter((member) => member.toString() === profile.id).length >
      0
    ) {
      throw new BadRequestException('You are already a member of this team');
    }

    foundProfile.joinedTeams.unshift(team);
    team.members.unshift(foundProfile);

    await team.save((err) => {
      if (err) throw new BadRequestException('Could not save team to DB');
    });

    await foundProfile.save((err) => {
      if (err) throw new BadRequestException('Could not save profile to DB');
    });

    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      members: team.members,
      version: team.version - 1,
      profile_id: profile.id,
    });

    return team;
  }

  async leaveTeam(_id: string, profile: ProfileDoc): Promise<TeamDoc> {
    const team: TeamDoc = await Team.findById(_id);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    if (
      team.members.filter((member) => member.toString() === profile.id)
        .length === 0
    ) {
      throw new NotFoundException('You are not a member of this team');
    }

    // Get the remove index in Team document
    const removeIndex = team.members
      .map((item) => item._id.toString())
      .indexOf(profile.id);

    // Splice out of Team members array
    team.members.splice(removeIndex, 1);

    // Get the remove index in Profile document
    const removeTeamIndex = profile.joinedTeams
      .map((item) => item._id.toString())
      .indexOf(team.id);

    // Splice out of Profile joinedTeams array
    profile.joinedTeams.splice(removeTeamIndex, 1);
    // Save data to DB
    await team.save((err) => {
      if (err) throw new NotFoundException('Could not save team to DB');
    });

    await profile.save((err) => {
      if (err) throw new NotFoundException('Could not save profile to DB');
    });

    new TeamUpdatedPublisher(natsWrapper.client).publish({
      id: team.id,
      title: team.title,
      members: team.members,
      version: team.version - 1,
      profile_id: profile.id,
    });

    return team;
  }

  async getTeamMembers(_id: string): Promise<ProfileDoc[]> {
    const team: TeamDoc = await Team.findById(_id);

    if (!team) {
      throw new NotFoundException('You should create team first');
    }

    return team.members;
  }
}
