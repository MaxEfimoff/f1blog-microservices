import { Test } from '@nestjs/testing';
import { CompanyService } from '../company.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyDoc } from '../schemas/company.schema';
import { ProfileDoc } from '../schemas/profile.schema';

describe('Company service', () => {
  let service: CompanyService;
  let profile: ProfileDoc;

  beforeEach(async () => {
    const fakeCompanyService: Partial<CompanyService> = {
      getCompany: () =>
        Promise.resolve({
          title: 'frfr',
          website: 'trtr.com',
        } as CompanyDoc),
      createCompany: ({}: CreateCompanyDto) =>
        Promise.resolve({ id: 1, title: 'ferfe' } as CompanyDoc),
    };

    const module = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: CompanyService,
          useValue: fakeCompanyService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('can create instance of CompanyService', async () => {
    expect(service).toBeDefined();
  });

  it('creates new company', async () => {
    const title = 'csdc';
    const website = 'www.test.com';

    const company = await service.createCompany(
      { title: title, website: website },
      profile,
    );

    expect(company.title).toEqual(title);
    expect(company.website).toEqual(website);
  });
});
