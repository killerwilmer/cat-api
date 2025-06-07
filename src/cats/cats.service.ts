import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { CatBreed } from '../shared/interfaces/cat-breed.interface';
import { CatBreedSearchResult } from '../shared/interfaces/cat-breed-search-result.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CatsService {
  private readonly logger = new Logger(CatsService.name);
  private readonly API_URL: string;
  private readonly API_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('CAT_API_URL')!;
    this.API_KEY = this.configService.get<string>('CAT_API_KEY')!;
  }

  async getBreeds(): Promise<CatBreed[]> {
    const response = await axios.get(`${this.API_URL}/breeds`, {
      headers: { 'x-api-key': this.API_KEY },
    });
    return response.data as CatBreed[];
  }

  async getBreedById(breedId: string) {
    const breeds = await this.getBreeds();
    return breeds.find((b) => b.id === breedId);
  }

  async searchBreeds(query: string): Promise<CatBreedSearchResult[]> {
    if (!query) return [];

    try {
      const response = await axios.get(`${this.API_URL}/breeds/search`, {
        params: { q: query },
        headers: {
          'x-api-key': this.API_KEY,
        },
      });

      return response.data as CatBreedSearchResult[];
    } catch (error: unknown) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      }

      this.logger.error(`Failed to search breeds: ${message}`);
      return [];
    }
  }
}
