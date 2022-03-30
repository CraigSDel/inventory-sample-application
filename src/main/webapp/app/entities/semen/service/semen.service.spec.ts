import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { SemenStatus } from 'app/entities/enumerations/semen-status.model';
import { ISemen, Semen } from '../semen.model';

import { SemenService } from './semen.service';

describe('Semen Service', () => {
  let service: SemenService;
  let httpMock: HttpTestingController;
  let elemDefault: ISemen;
  let expectedResult: ISemen | ISemen[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SemenService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      receivedDate: currentDate,
      status: SemenStatus.AVAILABLE,
      lastModified: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          receivedDate: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Semen', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          receivedDate: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          receivedDate: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.create(new Semen()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Semen', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          receivedDate: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          receivedDate: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Semen', () => {
      const patchObject = Object.assign({}, new Semen());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          receivedDate: currentDate,
          lastModified: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Semen', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          receivedDate: currentDate.format(DATE_TIME_FORMAT),
          status: 'BBBBBB',
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          receivedDate: currentDate,
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

    it('should delete a Semen', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSemenToCollectionIfMissing', () => {
      it('should add a Semen to an empty array', () => {
        const semen: ISemen = { id: 'ABC' };
        expectedResult = service.addSemenToCollectionIfMissing([], semen);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semen);
      });

      it('should not add a Semen to an array that contains it', () => {
        const semen: ISemen = { id: 'ABC' };
        const semenCollection: ISemen[] = [
          {
            ...semen,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addSemenToCollectionIfMissing(semenCollection, semen);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Semen to an array that doesn't contain it", () => {
        const semen: ISemen = { id: 'ABC' };
        const semenCollection: ISemen[] = [{ id: 'CBA' }];
        expectedResult = service.addSemenToCollectionIfMissing(semenCollection, semen);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semen);
      });

      it('should add only unique Semen to an array', () => {
        const semenArray: ISemen[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '7ee38784-b43f-46f1-bad8-0b4ebae5787c' }];
        const semenCollection: ISemen[] = [{ id: 'ABC' }];
        expectedResult = service.addSemenToCollectionIfMissing(semenCollection, ...semenArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const semen: ISemen = { id: 'ABC' };
        const semen2: ISemen = { id: 'CBA' };
        expectedResult = service.addSemenToCollectionIfMissing([], semen, semen2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semen);
        expect(expectedResult).toContain(semen2);
      });

      it('should accept null and undefined values', () => {
        const semen: ISemen = { id: 'ABC' };
        expectedResult = service.addSemenToCollectionIfMissing([], null, semen, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semen);
      });

      it('should return initial array if no Semen is added', () => {
        const semenCollection: ISemen[] = [{ id: 'ABC' }];
        expectedResult = service.addSemenToCollectionIfMissing(semenCollection, undefined, null);
        expect(expectedResult).toEqual(semenCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
