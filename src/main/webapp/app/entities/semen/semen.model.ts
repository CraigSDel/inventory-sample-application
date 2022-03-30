import dayjs from 'dayjs/esm';
import { ISemenDonor } from 'app/entities/semen-donor/semen-donor.model';
import { SemenStatus } from 'app/entities/enumerations/semen-status.model';

export interface ISemen {
  id?: string;
  receivedDate?: dayjs.Dayjs | null;
  status?: SemenStatus | null;
  lastModified?: dayjs.Dayjs | null;
  semenDonor?: ISemenDonor | null;
}

export class Semen implements ISemen {
  constructor(
    public id?: string,
    public receivedDate?: dayjs.Dayjs | null,
    public status?: SemenStatus | null,
    public lastModified?: dayjs.Dayjs | null,
    public semenDonor?: ISemenDonor | null
  ) {}
}

export function getSemenIdentifier(semen: ISemen): string | undefined {
  return semen.id;
}
