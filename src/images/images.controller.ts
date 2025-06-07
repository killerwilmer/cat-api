import { Controller, Get, Query } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('bybreedid')
  getImagesByBreed(@Query('breed_id') breedId: string) {
    return this.imagesService.getImagesByBreedId(breedId);
  }
}
