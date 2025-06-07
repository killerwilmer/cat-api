import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('/breeds')
  getAllBreeds() {
    return this.catsService.getBreeds();
  }

  @Get('/breeds/search')
  async searchBreed(@Query('q') query: string) {
    return this.catsService.searchBreeds(query);
  }

  @Get('/breeds/:breed_id')
  getBreed(@Param('breed_id') id: string) {
    return this.catsService.getBreedById(id);
  }
}
