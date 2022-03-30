import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBreed, Breed } from '../breed.model';

import { BreedService } from './breed.service';

describe('Breed Service', () => {
  let service: BreedService;
  let httpMock: HttpTestingController;
  let elemDefault: IBreed;
  let expectedResult: IBreed | IBreed[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BreedService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      description: 'AAAAAAA',
      dateAdded: currentDate,
      lastModified: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Breed', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.create(new Breed()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Breed', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Breed', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new Breed()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Breed', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateAdded: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Breed', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBreedToCollectionIfMissing', () => {
      it('should add a Breed to an empty array', () => {
        const breed: IBreed = { id: 'ABC' };
        expectedResult = service.addBreedToCollectionIfMissing([], breed);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(breed);
      });

      it('should not add a Breed to an array that contains it', () => {
        const breed: IBreed = { id: 'ABC' };
        const breedCollection: IBreed[] = [
          {
            ...breed,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addBreedToCollectionIfMissing(breedCollection, breed);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Breed to an array that doesn't contain it", () => {
        const breed: IBreed = { id: 'ABC' };
        const breedCollection: IBreed[] = [{ id: 'CBA' }];
        expectedResult = service.addBreedToCollectionIfMissing(breedCollection, breed);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(breed);
      });

      it('should add only unique Breed to an array', () => {
        const breedArray: IBreed[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '6e07eadc-f762-4819-a392-0ae1540a2faf' }];
        const breedCollection: IBreed[] = [{ id: 'ABC' }];
        expectedResult = service.addBreedToCollectionIfMissing(breedCollection, ...breedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const breed: IBreed = { id: 'ABC' };
        const breed2: IBreed = { id: 'CBA' };
        expectedResult = service.addBreedToCollectionIfMissing([], breed, breed2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(breed);
        expect(expectedResult).toContain(breed2);
      });

      it('should accept null and undefined values', () => {
        const breed: IBreed = { id: 'ABC' };
        expectedResult = service.addBreedToCollectionIfMissing([], null, breed, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(breed);
      });

      it('should return initial array if no Breed is added', () => {
        const breedCollection: IBreed[] = [{ id: 'ABC' }];
        expectedResult = service.addBreedToCollectionIfMissing(breedCollection, undefined, null);
        expect(expectedResult).toEqual(breedCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
