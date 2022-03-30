import dayjs from 'dayjs/esm';
import { ISemenDonor } from 'app/entities/semen-donor/semen-donor.model';

export interface IBreed {
  id?: string;
  description?: string | null;
  dateAdded?: dayjs.Dayjs | null;
  lastModified?: dayjs.Dayjs | null;
  semenDonors?: ISemenDonor[] | null;
}

export class Breed implements IBreed {
  constructor(
    public id?: string,
    public description?: string | null,
    public dateAdded?: dayjs.Dayjs | null,
    public lastModified?: dayjs.Dayjs | null,
    public semenDonors?: ISemenDonor[] | null
  ) {}
}

export function getBreedIdentifier(breed: IBreed): string | undefined {
  return breed.id;
}
