import { CatBreed } from './cat-breed.interface';

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: CatBreed[];
}
