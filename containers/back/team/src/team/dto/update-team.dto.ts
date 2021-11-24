import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'testtitle', description: 'Company title' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Test description', description: 'Team description' })
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: 'www.avatar.com/avatar', description: 'Team avatar' })
  @IsUrl()
  @IsOptional()
  readonly avatar: string;
}
