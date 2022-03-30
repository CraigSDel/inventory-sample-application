import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISemenDonor } from '../semen-donor.model';

@Component({
  selector: 'jhi-semen-donor-detail',
  templateUrl: './semen-donor-detail.component.html',
})
export class SemenDonorDetailComponent implements OnInit {
  semenDonor: ISemenDonor | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semenDonor }) => {
      this.semenDonor = semenDonor;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
