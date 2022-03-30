import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFarm } from '../farm.model';

@Component({
  selector: 'jhi-farm-detail',
  templateUrl: './farm-detail.component.html',
})
export class FarmDetailComponent implements OnInit {
  farm: IFarm | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ farm }) => {
      this.farm = farm;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
