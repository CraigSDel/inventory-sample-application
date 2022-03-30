import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SemenService } from '../service/semen.service';
import { ISemen, Semen } from '../semen.model';
import { ISemenDonor } from 'app/entities/semen-donor/semen-donor.model';
import { SemenDonorService } from 'app/entities/semen-donor/service/semen-donor.service';

import { SemenUpdateComponent } from './semen-update.component';

describe('Semen Management Update Component', () => {
  let comp: SemenUpdateComponent;
  let fixture: ComponentFixture<SemenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let semenService: SemenService;
  let semenDonorService: SemenDonorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SemenUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SemenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    semenService = TestBed.inject(SemenService);
    semenDonorService = TestBed.inject(SemenDonorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SemenDonor query and add missing value', () => {
      const semen: ISemen = { id: 'CBA' };
      const semenDonor: ISemenDonor = { id: '98987683-fc19-491f-bbd5-9eb32f91be0d' };
      semen.semenDonor = semenDonor;

      const semenDonorCollection: ISemenDonor[] = [{ id: 'ea169a08-3127-4845-a237-697e650eccc2' }];
      jest.spyOn(semenDonorService, 'query').mockReturnValue(of(new HttpResponse({ body: semenDonorCollection })));
      const additionalSemenDonors = [semenDonor];
      const expectedCollection: ISemenDonor[] = [...additionalSemenDonors, ...semenDonorCollection];
      jest.spyOn(semenDonorService, 'addSemenDonorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ semen });
      comp.ngOnInit();

      expect(semenDonorService.query).toHaveBeenCalled();
      expect(semenDonorService.addSemenDonorToCollectionIfMissing).toHaveBeenCalledWith(semenDonorCollection, ...additionalSemenDonors);
      expect(comp.semenDonorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const semen: ISemen = { id: 'CBA' };
      const semenDonor: ISemenDonor = { id: '6135f15e-1012-4656-8a1a-2352936a920a' };
      semen.semenDonor = semenDonor;

      activatedRoute.data = of({ semen });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(semen));
      expect(comp.semenDonorsSharedCollection).toContain(semenDonor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Semen>>();
      const semen = { id: 'ABC' };
      jest.spyOn(semenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semen }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(semenService.update).toHaveBeenCalledWith(semen);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Semen>>();
      const semen = new Semen();
      jest.spyOn(semenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semen }));
      saveSubject.complete();

      // THEN
      expect(semenService.create).toHaveBeenCalledWith(semen);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Semen>>();
      const semen = { id: 'ABC' };
      jest.spyOn(semenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(semenService.update).toHaveBeenCalledWith(semen);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSemenDonorById', () => {
      it('Should return tracked SemenDonor primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackSemenDonorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
