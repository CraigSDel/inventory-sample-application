import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SemenDonorDetailComponent } from './semen-donor-detail.component';

describe('SemenDonor Management Detail Component', () => {
  let comp: SemenDonorDetailComponent;
  let fixture: ComponentFixture<SemenDonorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemenDonorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ semenDonor: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(SemenDonorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SemenDonorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load semenDonor on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.semenDonor).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
