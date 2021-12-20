import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateStoryDto {
  @ApiProperty({ example: 'testtitle', description: 'Story title' })
  @IsString()
  readonly title: string;
}
