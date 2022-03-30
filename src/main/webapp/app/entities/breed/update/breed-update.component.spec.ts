import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BreedService } from '../service/breed.service';
import { IBreed, Breed } from '../breed.model';

import { BreedUpdateComponent } from './breed-update.component';

describe('Breed Management Update Component', () => {
  let comp: BreedUpdateComponent;
  let fixture: ComponentFixture<BreedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let breedService: BreedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BreedUpdateComponent],
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
      .overrideTemplate(BreedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BreedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    breedService = TestBed.inject(BreedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const breed: IBreed = { id: 'CBA' };

      activatedRoute.data = of({ breed });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(breed));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Breed>>();
      const breed = { id: 'ABC' };
      jest.spyOn(breedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ breed });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: breed }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(breedService.update).toHaveBeenCalledWith(breed);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Breed>>();
      const breed = new Breed();
      jest.spyOn(breedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ breed });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: breed }));
      saveSubject.complete();

      // THEN
      expect(breedService.create).toHaveBeenCalledWith(breed);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Breed>>();
      const breed = { id: 'ABC' };
      jest.spyOn(breedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ breed });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(breedService.update).toHaveBeenCalledWith(breed);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
