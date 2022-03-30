import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISemen, getSemenIdentifier } from '../semen.model';

export type EntityResponseType = HttpResponse<ISemen>;
export type EntityArrayResponseType = HttpResponse<ISemen[]>;

@Injectable({ providedIn: 'root' })
export class SemenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/semen');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(semen: ISemen): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(semen);
    return this.http
      .post<ISemen>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(semen: ISemen): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(semen);
    return this.http
      .put<ISemen>(`${this.resourceUrl}/${getSemenIdentifier(semen) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(semen: ISemen): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(semen);
    return this.http
      .patch<ISemen>(`${this.resourceUrl}/${getSemenIdentifier(semen) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ISemen>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISemen[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSemenToCollectionIfMissing(semenCollection: ISemen[], ...semenToCheck: (ISemen | null | undefined)[]): ISemen[] {
    const semen: ISemen[] = semenToCheck.filter(isPresent);
    if (semen.length > 0) {
      const semenCollectionIdentifiers = semenCollection.map(semenItem => getSemenIdentifier(semenItem)!);
      const semenToAdd = semen.filter(semenItem => {
        const semenIdentifier = getSemenIdentifier(semenItem);
        if (semenIdentifier == null || semenCollectionIdentifiers.includes(semenIdentifier)) {
          return false;
        }
        semenCollectionIdentifiers.push(semenIdentifier);
        return true;
      });
      return [...semenToAdd, ...semenCollection];
    }
    return semenCollection;
  }

  protected convertDateFromClient(semen: ISemen): ISemen {
    return Object.assign({}, semen, {
      receivedDate: semen.receivedDate?.isValid() ? semen.receivedDate.toJSON() : undefined,
      lastModified: semen.lastModified?.isValid() ? semen.lastModified.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.receivedDate = res.body.receivedDate ? dayjs(res.body.receivedDate) : undefined;
      res.body.lastModified = res.body.lastModified ? dayjs(res.body.lastModified) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((semen: ISemen) => {
        semen.receivedDate = semen.receivedDate ? dayjs(semen.receivedDate) : undefined;
        semen.lastModified = semen.lastModified ? dayjs(semen.lastModified) : undefined;
      });
    }
    return res;
  }
}
