import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBreed } from '../breed.model';
import { BreedService } from '../service/breed.service';

@Component({
  templateUrl: './breed-delete-dialog.component.html',
})
export class BreedDeleteDialogComponent {
  breed?: IBreed;

  constructor(protected breedService: BreedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.breedService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
