import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FarmDetailComponent } from './farm-detail.component';

describe('Farm Management Detail Component', () => {
  let comp: FarmDetailComponent;
  let fixture: ComponentFixture<FarmDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ farm: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(FarmDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FarmDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load farm on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.farm).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
