import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateStoryThreadCommentDto {
  @ApiProperty({
    example: 'testtext',
    description: 'Story thread comment text',
  })
  @IsString()
  readonly text: string;
}
