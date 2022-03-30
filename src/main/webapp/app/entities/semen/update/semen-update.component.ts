import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISemen, Semen } from '../semen.model';
import { SemenService } from '../service/semen.service';
import { ISemenDonor } from 'app/entities/semen-donor/semen-donor.model';
import { SemenDonorService } from 'app/entities/semen-donor/service/semen-donor.service';
import { SemenStatus } from 'app/entities/enumerations/semen-status.model';

@Component({
  selector: 'jhi-semen-update',
  templateUrl: './semen-update.component.html',
})
export class SemenUpdateComponent implements OnInit {
  isSaving = false;
  semenStatusValues = Object.keys(SemenStatus);

  semenDonorsSharedCollection: ISemenDonor[] = [];

  editForm = this.fb.group({
    id: [],
    description: [],
    receivedDate: [],
    status: [],
    dateAdded: [],
    lastModified: [],
    semenDonor: [],
  });

  constructor(
    protected semenService: SemenService,
    protected semenDonorService: SemenDonorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semen }) => {
      if (semen.id === undefined) {
        const today = dayjs().startOf('day');
        semen.receivedDate = today;
        semen.dateAdded = today;
        semen.lastModified = today;
      }

      this.updateForm(semen);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const semen = this.createFromForm();
    if (semen.id !== undefined) {
      this.subscribeToSaveResponse(this.semenService.update(semen));
    } else {
      this.subscribeToSaveResponse(this.semenService.create(semen));
    }
  }

  trackSemenDonorById(index: number, item: ISemenDonor): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISemen>>): void {
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

  protected updateForm(semen: ISemen): void {
    this.editForm.patchValue({
      id: semen.id,
      description: semen.description,
      receivedDate: semen.receivedDate ? semen.receivedDate.format(DATE_TIME_FORMAT) : null,
      status: semen.status,
      dateAdded: semen.dateAdded ? semen.dateAdded.format(DATE_TIME_FORMAT) : null,
      lastModified: semen.lastModified ? semen.lastModified.format(DATE_TIME_FORMAT) : null,
      semenDonor: semen.semenDonor,
    });

    this.semenDonorsSharedCollection = this.semenDonorService.addSemenDonorToCollectionIfMissing(
      this.semenDonorsSharedCollection,
      semen.semenDonor
    );
  }

  protected loadRelationshipsOptions(): void {
    this.semenDonorService
      .query()
      .pipe(map((res: HttpResponse<ISemenDonor[]>) => res.body ?? []))
      .pipe(
        map((semenDonors: ISemenDonor[]) =>
          this.semenDonorService.addSemenDonorToCollectionIfMissing(semenDonors, this.editForm.get('semenDonor')!.value)
        )
      )
      .subscribe((semenDonors: ISemenDonor[]) => (this.semenDonorsSharedCollection = semenDonors));
  }

  protected createFromForm(): ISemen {
    return {
      ...new Semen(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      receivedDate: this.editForm.get(['receivedDate'])!.value
        ? dayjs(this.editForm.get(['receivedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      dateAdded: this.editForm.get(['dateAdded'])!.value ? dayjs(this.editForm.get(['dateAdded'])!.value, DATE_TIME_FORMAT) : undefined,
      lastModified: this.editForm.get(['lastModified'])!.value
        ? dayjs(this.editForm.get(['lastModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
      semenDonor: this.editForm.get(['semenDonor'])!.value,
    };
  }
}
