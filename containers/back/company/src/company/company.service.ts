import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDoc, CompanyModel } from './schemas/company.schema';
import { Profile, ProfileDoc } from './schemas/profile.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-comany.dto';
import { BadRequestError } from '@f1blog/common';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDoc>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDoc>,
  ) {}

  async createCompany(
    companyDto: CreateCompanyDto,
    profile: ProfileDoc,
  ): Promise<CompanyDoc> {
    const company = await Company.find();

    if (company[0]) {
      console.log(company);
      throw new BadRequestError('Company already exists!');
    }

    const newCompany = Company.build({ profile: profile, ...companyDto });

    return newCompany.save();
  }

  async updateCompany(companyDto: UpdateCompanyDto): Promise<CompanyDoc> {
    const companies = await Company.find();
    const company = companies[0];

    if (!company) {
      throw new NotFoundError('You should create company first');
    }

    Object.assign(company, companyDto);

    return company.save();
  }

  async getCompany(): Promise<CompanyDoc> {
    const company = await Company.find();

    return company[0];
  }

  async getProfiles(): Promise<ProfileDoc[]> {
    const teams = await Profile.find().limit(1);

    return teams;
  }
}
