import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISemenDonor } from '../semen-donor.model';
import { SemenDonorService } from '../service/semen-donor.service';

@Component({
  templateUrl: './semen-donor-delete-dialog.component.html',
})
export class SemenDonorDeleteDialogComponent {
  semenDonor?: ISemenDonor;

  constructor(protected semenDonorService: SemenDonorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.semenDonorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
