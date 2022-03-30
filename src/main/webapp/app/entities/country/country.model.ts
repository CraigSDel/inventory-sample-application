import dayjs from 'dayjs/esm';
import { ILocation } from 'app/entities/location/location.model';

export interface ICountry {
  id?: string;
  countryName?: string | null;
  dateAdded?: dayjs.Dayjs | null;
  lastModified?: dayjs.Dayjs | null;
  locations?: ILocation[] | null;
}

export class Country implements ICountry {
  constructor(
    public id?: string,
    public countryName?: string | null,
    public dateAdded?: dayjs.Dayjs | null,
    public lastModified?: dayjs.Dayjs | null,
    public locations?: ILocation[] | null
  ) {}
}

export function getCountryIdentifier(country: ICountry): string | undefined {
  return country.id;
}
