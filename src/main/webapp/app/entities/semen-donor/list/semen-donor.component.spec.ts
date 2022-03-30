import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SemenDonorService } from '../service/semen-donor.service';

import { SemenDonorComponent } from './semen-donor.component';

describe('SemenDonor Management Component', () => {
  let comp: SemenDonorComponent;
  let fixture: ComponentFixture<SemenDonorComponent>;
  let service: SemenDonorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SemenDonorComponent],
    })
      .overrideTemplate(SemenDonorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemenDonorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SemenDonorService);

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
    expect(comp.semenDonors[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  it('should load a page', () => {
    // WHEN
    comp.loadPage(1);

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.semenDonors[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalledWith(expect.objectContaining({ sort: ['id,asc'] }));
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // INIT
    comp.ngOnInit();

    // GIVEN
    comp.predicate = 'name';

    // WHEN
    comp.loadPage(1);

    // THEN
    expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['name,asc', 'id'] }));
  });

  it('should re-initialize the page', () => {
    // WHEN
    comp.loadPage(1);
    comp.reset();

    // THEN
    expect(comp.page).toEqual(0);
    expect(service.query).toHaveBeenCalledTimes(2);
    expect(comp.semenDonors[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });
});
