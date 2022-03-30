import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICountry, getCountryIdentifier } from '../country.model';

export type EntityResponseType = HttpResponse<ICountry>;
export type EntityArrayResponseType = HttpResponse<ICountry[]>;

@Injectable({ providedIn: 'root' })
export class CountryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/countries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(country: ICountry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .post<ICountry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(country: ICountry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .put<ICountry>(`${this.resourceUrl}/${getCountryIdentifier(country) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(country: ICountry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(country);
    return this.http
      .patch<ICountry>(`${this.resourceUrl}/${getCountryIdentifier(country) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ICountry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICountry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCountryToCollectionIfMissing(countryCollection: ICountry[], ...countriesToCheck: (ICountry | null | undefined)[]): ICountry[] {
    const countries: ICountry[] = countriesToCheck.filter(isPresent);
    if (countries.length > 0) {
      const countryCollectionIdentifiers = countryCollection.map(countryItem => getCountryIdentifier(countryItem)!);
      const countriesToAdd = countries.filter(countryItem => {
        const countryIdentifier = getCountryIdentifier(countryItem);
        if (countryIdentifier == null || countryCollectionIdentifiers.includes(countryIdentifier)) {
          return false;
        }
        countryCollectionIdentifiers.push(countryIdentifier);
        return true;
      });
      return [...countriesToAdd, ...countryCollection];
    }
    return countryCollection;
  }

  protected convertDateFromClient(country: ICountry): ICountry {
    return Object.assign({}, country, {
      dateAdded: country.dateAdded?.isValid() ? country.dateAdded.toJSON() : undefined,
      lastModified: country.lastModified?.isValid() ? country.lastModified.toJSON() : undefined,
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
      res.body.forEach((country: ICountry) => {
        country.dateAdded = country.dateAdded ? dayjs(country.dateAdded) : undefined;
        country.lastModified = country.lastModified ? dayjs(country.lastModified) : undefined;
      });
    }
    return res;
  }
}
