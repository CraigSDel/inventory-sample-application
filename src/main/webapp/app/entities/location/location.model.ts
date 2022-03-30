import dayjs from 'dayjs/esm';
import { IFarm } from 'app/entities/farm/farm.model';
import { ICountry } from 'app/entities/country/country.model';

export interface ILocation {
  id?: string;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  dateAdded?: dayjs.Dayjs | null;
  lastModified?: dayjs.Dayjs | null;
  farms?: IFarm[] | null;
  country?: ICountry | null;
}

export class Location implements ILocation {
  constructor(
    public id?: string,
    public streetAddress?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public stateProvince?: string | null,
    public dateAdded?: dayjs.Dayjs | null,
    public lastModified?: dayjs.Dayjs | null,
    public farms?: IFarm[] | null,
    public country?: ICountry | null
  ) {}
}

export function getLocationIdentifier(location: ILocation): string | undefined {
  return location.id;
}
