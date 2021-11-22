import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-comany.dto';
import { ProfileDoc, Profile } from './schemas/profile.schema';
import { CompanyDoc, Company } from './schemas/company.schema';
import { CurrentProfile } from './decorators/current-profile.decorator';

@ApiTags('Company')
@Controller('/api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Company creation' })
  @ApiResponse({ status: 201, type: Company })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  createCompany(
    @Body() body: CreateCompanyDto,
    @CurrentProfile() profile: ProfileDoc,
  ) {
    return this.companyService.createCompany(body, profile);
  }

  @ApiOperation({ summary: 'Company update' })
  @ApiResponse({ status: 201, type: Company })
  @Patch('/')
  @HttpCode(HttpStatus.CREATED)
  updateCompany(@Body() body: UpdateCompanyDto) {
    return this.companyService.updateCompany(body);
  }

  @ApiOperation({ summary: 'Company fetch' })
  @ApiResponse({ status: 200, type: Company })
  @Get('/')
  getCompany(): Promise<CompanyDoc> {
    return this.companyService.getCompany();
  }

  @ApiOperation({ summary: 'Profiles fetch' })
  @ApiResponse({ status: 201, type: [Profile] })
  @Get('/profiles')
  getProfiles(): Promise<ProfileDoc[]> {
    return this.companyService.getProfiles();
  }
}
