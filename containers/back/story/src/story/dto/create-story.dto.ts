import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({ example: 'testtitle', description: 'Story title' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'testtext', description: 'Story text' })
  @IsString()
  readonly text: string;
}
