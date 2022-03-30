import dayjs from 'dayjs/esm';
import { ISemenDonor } from 'app/entities/semen-donor/semen-donor.model';
import { ILocation } from 'app/entities/location/location.model';

export interface IFarm {
  id?: string;
  name?: string | null;
  dateAdded?: dayjs.Dayjs | null;
  lastModified?: dayjs.Dayjs | null;
  semenDonors?: ISemenDonor[] | null;
  location?: ILocation | null;
}

export class Farm implements IFarm {
  constructor(
    public id?: string,
    public name?: string | null,
    public dateAdded?: dayjs.Dayjs | null,
    public lastModified?: dayjs.Dayjs | null,
    public semenDonors?: ISemenDonor[] | null,
    public location?: ILocation | null
  ) {}
}

export function getFarmIdentifier(farm: IFarm): string | undefined {
  return farm.id;
}
