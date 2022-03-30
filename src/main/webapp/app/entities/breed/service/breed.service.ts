import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBreed, getBreedIdentifier } from '../breed.model';

export type EntityResponseType = HttpResponse<IBreed>;
export type EntityArrayResponseType = HttpResponse<IBreed[]>;

@Injectable({ providedIn: 'root' })
export class BreedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/breeds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(breed: IBreed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(breed);
    return this.http
      .post<IBreed>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(breed: IBreed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(breed);
    return this.http
      .put<IBreed>(`${this.resourceUrl}/${getBreedIdentifier(breed) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(breed: IBreed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(breed);
    return this.http
      .patch<IBreed>(`${this.resourceUrl}/${getBreedIdentifier(breed) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IBreed>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBreed[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBreedToCollectionIfMissing(breedCollection: IBreed[], ...breedsToCheck: (IBreed | null | undefined)[]): IBreed[] {
    const breeds: IBreed[] = breedsToCheck.filter(isPresent);
    if (breeds.length > 0) {
      const breedCollectionIdentifiers = breedCollection.map(breedItem => getBreedIdentifier(breedItem)!);
      const breedsToAdd = breeds.filter(breedItem => {
        const breedIdentifier = getBreedIdentifier(breedItem);
        if (breedIdentifier == null || breedCollectionIdentifiers.includes(breedIdentifier)) {
          return false;
        }
        breedCollectionIdentifiers.push(breedIdentifier);
        return true;
      });
      return [...breedsToAdd, ...breedCollection];
    }
    return breedCollection;
  }

  protected convertDateFromClient(breed: IBreed): IBreed {
    return Object.assign({}, breed, {
      dateAdded: breed.dateAdded?.isValid() ? breed.dateAdded.toJSON() : undefined,
      lastModified: breed.lastModified?.isValid() ? breed.lastModified.toJSON() : undefined,
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
      res.body.forEach((breed: IBreed) => {
        breed.dateAdded = breed.dateAdded ? dayjs(breed.dateAdded) : undefined;
        breed.lastModified = breed.lastModified ? dayjs(breed.lastModified) : undefined;
      });
    }
    return res;
  }
}
