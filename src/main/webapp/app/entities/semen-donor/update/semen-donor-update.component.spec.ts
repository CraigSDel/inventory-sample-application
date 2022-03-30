import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SemenDonorService } from '../service/semen-donor.service';
import { ISemenDonor, SemenDonor } from '../semen-donor.model';
import { IFarm } from 'app/entities/farm/farm.model';
import { FarmService } from 'app/entities/farm/service/farm.service';
import { IBreed } from 'app/entities/breed/breed.model';
import { BreedService } from 'app/entities/breed/service/breed.service';

import { SemenDonorUpdateComponent } from './semen-donor-update.component';

describe('SemenDonor Management Update Component', () => {
  let comp: SemenDonorUpdateComponent;
  let fixture: ComponentFixture<SemenDonorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let semenDonorService: SemenDonorService;
  let farmService: FarmService;
  let breedService: BreedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SemenDonorUpdateComponent],
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
      .overrideTemplate(SemenDonorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemenDonorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    semenDonorService = TestBed.inject(SemenDonorService);
    farmService = TestBed.inject(FarmService);
    breedService = TestBed.inject(BreedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Farm query and add missing value', () => {
      const semenDonor: ISemenDonor = { id: 'CBA' };
      const farm: IFarm = { id: '5cc51823-a92e-4709-b93d-c4a4e8bbe23d' };
      semenDonor.farm = farm;

      const farmCollection: IFarm[] = [{ id: '5202afee-325a-47bd-be5d-8a666ef0a0e7' }];
      jest.spyOn(farmService, 'query').mockReturnValue(of(new HttpResponse({ body: farmCollection })));
      const additionalFarms = [farm];
      const expectedCollection: IFarm[] = [...additionalFarms, ...farmCollection];
      jest.spyOn(farmService, 'addFarmToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ semenDonor });
      comp.ngOnInit();

      expect(farmService.query).toHaveBeenCalled();
      expect(farmService.addFarmToCollectionIfMissing).toHaveBeenCalledWith(farmCollection, ...additionalFarms);
      expect(comp.farmsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Breed query and add missing value', () => {
      const semenDonor: ISemenDonor = { id: 'CBA' };
      const breed: IBreed = { id: 'b2036c6a-1c48-4b20-b172-bad460e8bc8c' };
      semenDonor.breed = breed;

      const breedCollection: IBreed[] = [{ id: 'b7d5afee-ed90-418f-bbee-3927b83cf092' }];
      jest.spyOn(breedService, 'query').mockReturnValue(of(new HttpResponse({ body: breedCollection })));
      const additionalBreeds = [breed];
      const expectedCollection: IBreed[] = [...additionalBreeds, ...breedCollection];
      jest.spyOn(breedService, 'addBreedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ semenDonor });
      comp.ngOnInit();

      expect(breedService.query).toHaveBeenCalled();
      expect(breedService.addBreedToCollectionIfMissing).toHaveBeenCalledWith(breedCollection, ...additionalBreeds);
      expect(comp.breedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const semenDonor: ISemenDonor = { id: 'CBA' };
      const farm: IFarm = { id: 'f6bef020-b329-4be8-862b-c9162a1a5c3f' };
      semenDonor.farm = farm;
      const breed: IBreed = { id: '7cf62d3e-e404-4dd3-a514-572b5601c0e5' };
      semenDonor.breed = breed;

      activatedRoute.data = of({ semenDonor });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(semenDonor));
      expect(comp.farmsSharedCollection).toContain(farm);
      expect(comp.breedsSharedCollection).toContain(breed);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SemenDonor>>();
      const semenDonor = { id: 'ABC' };
      jest.spyOn(semenDonorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semenDonor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semenDonor }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(semenDonorService.update).toHaveBeenCalledWith(semenDonor);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SemenDonor>>();
      const semenDonor = new SemenDonor();
      jest.spyOn(semenDonorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semenDonor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semenDonor }));
      saveSubject.complete();

      // THEN
      expect(semenDonorService.create).toHaveBeenCalledWith(semenDonor);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SemenDonor>>();
      const semenDonor = { id: 'ABC' };
      jest.spyOn(semenDonorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semenDonor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(semenDonorService.update).toHaveBeenCalledWith(semenDonor);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFarmById', () => {
      it('Should return tracked Farm primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackFarmById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBreedById', () => {
      it('Should return tracked Breed primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackBreedById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
