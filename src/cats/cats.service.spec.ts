import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'CAT_API_KEY') return 'fake_key';
              if (key === 'CAT_API_URL') return 'https://api.thecatapi.com/v1';
              return null;
            },
          },
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return empty array on failed search', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API error'));

    const result = await service.searchBreeds('persian');
    expect(result).toEqual([]);
  });
});
