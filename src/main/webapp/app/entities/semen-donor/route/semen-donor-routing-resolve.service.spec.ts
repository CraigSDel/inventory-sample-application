import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISemenDonor, SemenDonor } from '../semen-donor.model';
import { SemenDonorService } from '../service/semen-donor.service';

import { SemenDonorRoutingResolveService } from './semen-donor-routing-resolve.service';

describe('SemenDonor routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SemenDonorRoutingResolveService;
  let service: SemenDonorService;
  let resultSemenDonor: ISemenDonor | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(SemenDonorRoutingResolveService);
    service = TestBed.inject(SemenDonorService);
    resultSemenDonor = undefined;
  });

  describe('resolve', () => {
    it('should return ISemenDonor returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSemenDonor = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultSemenDonor).toEqual({ id: 'ABC' });
    });

    it('should return new ISemenDonor if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSemenDonor = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSemenDonor).toEqual(new SemenDonor());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as SemenDonor })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSemenDonor = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultSemenDonor).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
