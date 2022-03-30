import dayjs from 'dayjs/esm';
import { ISemen } from 'app/entities/semen/semen.model';
import { IFarm } from 'app/entities/farm/farm.model';
import { IBreed } from 'app/entities/breed/breed.model';

export interface ISemenDonor {
  id?: string;
  producing?: boolean | null;
  lastModified?: dayjs.Dayjs | null;
  semen?: ISemen[] | null;
  farm?: IFarm | null;
  breed?: IBreed | null;
}

export class SemenDonor implements ISemenDonor {
  constructor(
    public id?: string,
    public producing?: boolean | null,
    public lastModified?: dayjs.Dayjs | null,
    public semen?: ISemen[] | null,
    public farm?: IFarm | null,
    public breed?: IBreed | null
  ) {
    this.producing = this.producing ?? false;
  }
}

export function getSemenDonorIdentifier(semenDonor: ISemenDonor): string | undefined {
  return semenDonor.id;
}
