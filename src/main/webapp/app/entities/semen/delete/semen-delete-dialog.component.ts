import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISemen } from '../semen.model';
import { SemenService } from '../service/semen.service';

@Component({
  templateUrl: './semen-delete-dialog.component.html',
})
export class SemenDeleteDialogComponent {
  semen?: ISemen;

  constructor(protected semenService: SemenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.semenService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
