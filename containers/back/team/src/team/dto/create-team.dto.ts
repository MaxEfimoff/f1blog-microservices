import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'testtitle', description: 'Team title' })
  @IsString()
  readonly title: string;
  readonly members?: string[];
}
