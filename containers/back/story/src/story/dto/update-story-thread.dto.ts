import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateStoryThreadDto {
  @ApiProperty({ example: 'testtext', description: 'Story thread text' })
  @IsString()
  readonly text: string;
}
