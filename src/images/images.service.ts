import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CatImage } from '../shared/interfaces/cat-image.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  private readonly API_URL: string;
  private readonly API_KEY: string;

  constructor(private readonly configService: ConfigService) {
    this.API_URL = this.configService.get<string>('CAT_API_URL')!;
    this.API_KEY = this.configService.get<string>('CAT_API_KEY')!;
  }

  async getImagesByBreedId(breedId: string): Promise<CatImage[]> {
    if (!breedId) return [];

    try {
      const response = await axios.get(`${this.API_URL}/images/search`, {
        params: {
          breed_id: breedId,
          limit: 10,
        },
        headers: {
          'x-api-key': this.API_KEY,
        },
      });

      return response.data as CatImage[];
    } catch (error) {
      console.error('Error fetching images by breed:', error.message);
      return [];
    }
  }
}
