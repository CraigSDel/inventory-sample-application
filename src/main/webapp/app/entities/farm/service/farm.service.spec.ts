import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFarm, Farm } from '../farm.model';

import { FarmService } from './farm.service';

describe('Farm Service', () => {
  let service: FarmService;
  let httpMock: HttpTestingController;
  let elemDefault: IFarm;
  let expectedResult: IFarm | IFarm[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FarmService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      name: 'AAAAAAA',
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

    it('should create a Farm', () => {
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

      service.create(new Farm()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Farm', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
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

    it('should partial update a Farm', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          lastModified: currentDate.format(DATE_TIME_FORMAT),
        },
        new Farm()
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

    it('should return a list of Farm', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          name: 'BBBBBB',
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

    it('should delete a Farm', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFarmToCollectionIfMissing', () => {
      it('should add a Farm to an empty array', () => {
        const farm: IFarm = { id: 'ABC' };
        expectedResult = service.addFarmToCollectionIfMissing([], farm);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(farm);
      });

      it('should not add a Farm to an array that contains it', () => {
        const farm: IFarm = { id: 'ABC' };
        const farmCollection: IFarm[] = [
          {
            ...farm,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addFarmToCollectionIfMissing(farmCollection, farm);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Farm to an array that doesn't contain it", () => {
        const farm: IFarm = { id: 'ABC' };
        const farmCollection: IFarm[] = [{ id: 'CBA' }];
        expectedResult = service.addFarmToCollectionIfMissing(farmCollection, farm);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(farm);
      });

      it('should add only unique Farm to an array', () => {
        const farmArray: IFarm[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'f2293f2a-5330-408e-ba92-dff4482dc0f9' }];
        const farmCollection: IFarm[] = [{ id: 'ABC' }];
        expectedResult = service.addFarmToCollectionIfMissing(farmCollection, ...farmArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const farm: IFarm = { id: 'ABC' };
        const farm2: IFarm = { id: 'CBA' };
        expectedResult = service.addFarmToCollectionIfMissing([], farm, farm2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(farm);
        expect(expectedResult).toContain(farm2);
      });

      it('should accept null and undefined values', () => {
        const farm: IFarm = { id: 'ABC' };
        expectedResult = service.addFarmToCollectionIfMissing([], null, farm, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(farm);
      });

      it('should return initial array if no Farm is added', () => {
        const farmCollection: IFarm[] = [{ id: 'ABC' }];
        expectedResult = service.addFarmToCollectionIfMissing(farmCollection, undefined, null);
        expect(expectedResult).toEqual(farmCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
