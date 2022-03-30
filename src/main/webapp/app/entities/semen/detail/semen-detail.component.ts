import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISemen } from '../semen.model';

@Component({
  selector: 'jhi-semen-detail',
  templateUrl: './semen-detail.component.html',
})
export class SemenDetailComponent implements OnInit {
  semen: ISemen | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semen }) => {
      this.semen = semen;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
