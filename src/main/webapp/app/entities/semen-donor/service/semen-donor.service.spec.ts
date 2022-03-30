import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISemenDonor, SemenDonor } from '../semen-donor.model';

import { SemenDonorService } from './semen-donor.service';

describe('SemenDonor Service', () => {
  let service: SemenDonorService;
  let httpMock: HttpTestingController;
  let elemDefault: ISemenDonor;
  let expectedResult: ISemenDonor | ISemenDonor[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SemenDonorService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      description: 'AAAAAAA',
      producing: false,
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

    it('should create a SemenDonor', () => {
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

      service.create(new SemenDonor()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SemenDonor', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          producing: true,
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

    it('should partial update a SemenDonor', () => {
      const patchObject = Object.assign(
        {
          producing: true,
          dateAdded: currentDate.format(DATE_TIME_FORMAT),
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        new SemenDonor()
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

    it('should return a list of SemenDonor', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          producing: true,
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

    it('should delete a SemenDonor', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSemenDonorToCollectionIfMissing', () => {
      it('should add a SemenDonor to an empty array', () => {
        const semenDonor: ISemenDonor = { id: 'ABC' };
        expectedResult = service.addSemenDonorToCollectionIfMissing([], semenDonor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semenDonor);
      });

      it('should not add a SemenDonor to an array that contains it', () => {
        const semenDonor: ISemenDonor = { id: 'ABC' };
        const semenDonorCollection: ISemenDonor[] = [
          {
            ...semenDonor,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addSemenDonorToCollectionIfMissing(semenDonorCollection, semenDonor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SemenDonor to an array that doesn't contain it", () => {
        const semenDonor: ISemenDonor = { id: 'ABC' };
        const semenDonorCollection: ISemenDonor[] = [{ id: 'CBA' }];
        expectedResult = service.addSemenDonorToCollectionIfMissing(semenDonorCollection, semenDonor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semenDonor);
      });

      it('should add only unique SemenDonor to an array', () => {
        const semenDonorArray: ISemenDonor[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '77a5dc38-349e-4a81-8602-a2db26fa474d' }];
        const semenDonorCollection: ISemenDonor[] = [{ id: 'ABC' }];
        expectedResult = service.addSemenDonorToCollectionIfMissing(semenDonorCollection, ...semenDonorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const semenDonor: ISemenDonor = { id: 'ABC' };
        const semenDonor2: ISemenDonor = { id: 'CBA' };
        expectedResult = service.addSemenDonorToCollectionIfMissing([], semenDonor, semenDonor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semenDonor);
        expect(expectedResult).toContain(semenDonor2);
      });

      it('should accept null and undefined values', () => {
        const semenDonor: ISemenDonor = { id: 'ABC' };
        expectedResult = service.addSemenDonorToCollectionIfMissing([], null, semenDonor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semenDonor);
      });

      it('should return initial array if no SemenDonor is added', () => {
        const semenDonorCollection: ISemenDonor[] = [{ id: 'ABC' }];
        expectedResult = service.addSemenDonorToCollectionIfMissing(semenDonorCollection, undefined, null);
        expect(expectedResult).toEqual(semenDonorCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
