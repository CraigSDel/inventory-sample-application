import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISemenDonor, SemenDonor } from '../semen-donor.model';
import { SemenDonorService } from '../service/semen-donor.service';
import { IFarm } from 'app/entities/farm/farm.model';
import { FarmService } from 'app/entities/farm/service/farm.service';
import { IBreed } from 'app/entities/breed/breed.model';
import { BreedService } from 'app/entities/breed/service/breed.service';

@Component({
  selector: 'jhi-semen-donor-update',
  templateUrl: './semen-donor-update.component.html',
})
export class SemenDonorUpdateComponent implements OnInit {
  isSaving = false;

  farmsSharedCollection: IFarm[] = [];
  breedsSharedCollection: IBreed[] = [];

  editForm = this.fb.group({
    id: [],
    producing: [],
    lastModified: [],
    farm: [],
    breed: [],
  });

  constructor(
    protected semenDonorService: SemenDonorService,
    protected farmService: FarmService,
    protected breedService: BreedService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semenDonor }) => {
      if (semenDonor.id === undefined) {
        const today = dayjs().startOf('day');
        semenDonor.lastModified = today;
      }

      this.updateForm(semenDonor);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const semenDonor = this.createFromForm();
    if (semenDonor.id !== undefined) {
      this.subscribeToSaveResponse(this.semenDonorService.update(semenDonor));
    } else {
      this.subscribeToSaveResponse(this.semenDonorService.create(semenDonor));
    }
  }

  trackFarmById(index: number, item: IFarm): string {
    return item.id!;
  }

  trackBreedById(index: number, item: IBreed): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISemenDonor>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(semenDonor: ISemenDonor): void {
    this.editForm.patchValue({
      id: semenDonor.id,
      producing: semenDonor.producing,
      lastModified: semenDonor.lastModified ? semenDonor.lastModified.format(DATE_TIME_FORMAT) : null,
      farm: semenDonor.farm,
      breed: semenDonor.breed,
    });

    this.farmsSharedCollection = this.farmService.addFarmToCollectionIfMissing(this.farmsSharedCollection, semenDonor.farm);
    this.breedsSharedCollection = this.breedService.addBreedToCollectionIfMissing(this.breedsSharedCollection, semenDonor.breed);
  }

  protected loadRelationshipsOptions(): void {
    this.farmService
      .query()
      .pipe(map((res: HttpResponse<IFarm[]>) => res.body ?? []))
      .pipe(map((farms: IFarm[]) => this.farmService.addFarmToCollectionIfMissing(farms, this.editForm.get('farm')!.value)))
      .subscribe((farms: IFarm[]) => (this.farmsSharedCollection = farms));

    this.breedService
      .query()
      .pipe(map((res: HttpResponse<IBreed[]>) => res.body ?? []))
      .pipe(map((breeds: IBreed[]) => this.breedService.addBreedToCollectionIfMissing(breeds, this.editForm.get('breed')!.value)))
      .subscribe((breeds: IBreed[]) => (this.breedsSharedCollection = breeds));
  }

  protected createFromForm(): ISemenDonor {
    return {
      ...new SemenDonor(),
      id: this.editForm.get(['id'])!.value,
      producing: this.editForm.get(['producing'])!.value,
      lastModified: this.editForm.get(['lastModified'])!.value
        ? dayjs(this.editForm.get(['lastModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
      farm: this.editForm.get(['farm'])!.value,
      breed: this.editForm.get(['breed'])!.value,
    };
  }
}
