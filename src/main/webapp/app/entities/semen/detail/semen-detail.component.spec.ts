import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SemenDetailComponent } from './semen-detail.component';

describe('Semen Management Detail Component', () => {
  let comp: SemenDetailComponent;
  let fixture: ComponentFixture<SemenDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemenDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ semen: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(SemenDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SemenDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load semen on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.semen).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
