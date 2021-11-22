import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'testtitle', description: 'Company title' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'www.test.com', description: 'Company website' })
  @IsUrl()
  @IsOptional()
  readonly website: string;
}
