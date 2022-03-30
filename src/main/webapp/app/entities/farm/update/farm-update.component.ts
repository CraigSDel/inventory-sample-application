import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFarm, Farm } from '../farm.model';
import { FarmService } from '../service/farm.service';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

@Component({
  selector: 'jhi-farm-update',
  templateUrl: './farm-update.component.html',
})
export class FarmUpdateComponent implements OnInit {
  isSaving = false;

  locationsSharedCollection: ILocation[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    dateAdded: [],
    lastModified: [],
    location: [],
  });

  constructor(
    protected farmService: FarmService,
    protected locationService: LocationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ farm }) => {
      if (farm.id === undefined) {
        const today = dayjs().startOf('day');
        farm.dateAdded = today;
        farm.lastModified = today;
      }

      this.updateForm(farm);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const farm = this.createFromForm();
    if (farm.id !== undefined) {
      this.subscribeToSaveResponse(this.farmService.update(farm));
    } else {
      this.subscribeToSaveResponse(this.farmService.create(farm));
    }
  }

  trackLocationById(index: number, item: ILocation): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFarm>>): void {
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

  protected updateForm(farm: IFarm): void {
    this.editForm.patchValue({
      id: farm.id,
      name: farm.name,
      description: farm.description,
      dateAdded: farm.dateAdded ? farm.dateAdded.format(DATE_TIME_FORMAT) : null,
      lastModified: farm.lastModified ? farm.lastModified.format(DATE_TIME_FORMAT) : null,
      location: farm.location,
    });

    this.locationsSharedCollection = this.locationService.addLocationToCollectionIfMissing(this.locationsSharedCollection, farm.location);
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query()
      .pipe(map((res: HttpResponse<ILocation[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocation[]) =>
          this.locationService.addLocationToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocation[]) => (this.locationsSharedCollection = locations));
  }

  protected createFromForm(): IFarm {
    return {
      ...new Farm(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateAdded: this.editForm.get(['dateAdded'])!.value ? dayjs(this.editForm.get(['dateAdded'])!.value, DATE_TIME_FORMAT) : undefined,
      lastModified: this.editForm.get(['lastModified'])!.value
        ? dayjs(this.editForm.get(['lastModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
