import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISemenDonor, getSemenDonorIdentifier } from '../semen-donor.model';

export type EntityResponseType = HttpResponse<ISemenDonor>;
export type EntityArrayResponseType = HttpResponse<ISemenDonor[]>;

@Injectable({ providedIn: 'root' })
export class SemenDonorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/semen-donors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(semenDonor: ISemenDonor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(semenDonor);
    return this.http
      .post<ISemenDonor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(semenDonor: ISemenDonor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(semenDonor);
    return this.http
      .put<ISemenDonor>(`${this.resourceUrl}/${getSemenDonorIdentifier(semenDonor) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(semenDonor: ISemenDonor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(semenDonor);
    return this.http
      .patch<ISemenDonor>(`${this.resourceUrl}/${getSemenDonorIdentifier(semenDonor) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ISemenDonor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISemenDonor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSemenDonorToCollectionIfMissing(
    semenDonorCollection: ISemenDonor[],
    ...semenDonorsToCheck: (ISemenDonor | null | undefined)[]
  ): ISemenDonor[] {
    const semenDonors: ISemenDonor[] = semenDonorsToCheck.filter(isPresent);
    if (semenDonors.length > 0) {
      const semenDonorCollectionIdentifiers = semenDonorCollection.map(semenDonorItem => getSemenDonorIdentifier(semenDonorItem)!);
      const semenDonorsToAdd = semenDonors.filter(semenDonorItem => {
        const semenDonorIdentifier = getSemenDonorIdentifier(semenDonorItem);
        if (semenDonorIdentifier == null || semenDonorCollectionIdentifiers.includes(semenDonorIdentifier)) {
          return false;
        }
        semenDonorCollectionIdentifiers.push(semenDonorIdentifier);
        return true;
      });
      return [...semenDonorsToAdd, ...semenDonorCollection];
    }
    return semenDonorCollection;
  }

  protected convertDateFromClient(semenDonor: ISemenDonor): ISemenDonor {
    return Object.assign({}, semenDonor, {
      dateAdded: semenDonor.dateAdded?.isValid() ? semenDonor.dateAdded.toJSON() : undefined,
      lastModified: semenDonor.lastModified?.isValid() ? semenDonor.lastModified.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAdded = res.body.dateAdded ? dayjs(res.body.dateAdded) : undefined;
      res.body.lastModified = res.body.lastModified ? dayjs(res.body.lastModified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((semenDonor: ISemenDonor) => {
        semenDonor.dateAdded = semenDonor.dateAdded ? dayjs(semenDonor.dateAdded) : undefined;
        semenDonor.lastModified = semenDonor.lastModified ? dayjs(semenDonor.lastModified) : undefined;
      });
    }
    return res;
  }
}
