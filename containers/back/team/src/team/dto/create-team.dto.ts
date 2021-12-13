import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'testtitle', description: 'Team title' })
  @IsString()
  readonly title: string;
  readonly members?: string[];
}
