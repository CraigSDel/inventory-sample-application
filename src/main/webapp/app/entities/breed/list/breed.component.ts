import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBreed } from '../breed.model';
import { BreedService } from '../service/breed.service';
import { BreedDeleteDialogComponent } from '../delete/breed-delete-dialog.component';

@Component({
  selector: 'jhi-breed',
  templateUrl: './breed.component.html',
})
export class BreedComponent implements OnInit {
  breeds?: IBreed[];
  isLoading = false;

  constructor(protected breedService: BreedService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.breedService.query().subscribe({
      next: (res: HttpResponse<IBreed[]>) => {
        this.isLoading = false;
        this.breeds = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBreed): string {
    return item.id!;
  }

  delete(breed: IBreed): void {
    const modalRef = this.modalService.open(BreedDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.breed = breed;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
