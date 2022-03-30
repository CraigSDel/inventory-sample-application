import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BreedService } from '../service/breed.service';

import { BreedComponent } from './breed.component';

describe('Breed Management Component', () => {
  let comp: BreedComponent;
  let fixture: ComponentFixture<BreedComponent>;
  let service: BreedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BreedComponent],
    })
      .overrideTemplate(BreedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BreedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BreedService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.breeds?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
