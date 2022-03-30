import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBreed, Breed } from '../breed.model';
import { BreedService } from '../service/breed.service';

@Component({
  selector: 'jhi-breed-update',
  templateUrl: './breed-update.component.html',
})
export class BreedUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [],
    dateAdded: [],
    lastModified: [],
  });

  constructor(protected breedService: BreedService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ breed }) => {
      if (breed.id === undefined) {
        const today = dayjs().startOf('day');
        breed.dateAdded = today;
        breed.lastModified = today;
      }

      this.updateForm(breed);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const breed = this.createFromForm();
    if (breed.id !== undefined) {
      this.subscribeToSaveResponse(this.breedService.update(breed));
    } else {
      this.subscribeToSaveResponse(this.breedService.create(breed));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBreed>>): void {
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

  protected updateForm(breed: IBreed): void {
    this.editForm.patchValue({
      id: breed.id,
      description: breed.description,
      dateAdded: breed.dateAdded ? breed.dateAdded.format(DATE_TIME_FORMAT) : null,
      lastModified: breed.lastModified ? breed.lastModified.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IBreed {
    return {
      ...new Breed(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      dateAdded: this.editForm.get(['dateAdded'])!.value ? dayjs(this.editForm.get(['dateAdded'])!.value, DATE_TIME_FORMAT) : undefined,
      lastModified: this.editForm.get(['lastModified'])!.value
        ? dayjs(this.editForm.get(['lastModified'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
