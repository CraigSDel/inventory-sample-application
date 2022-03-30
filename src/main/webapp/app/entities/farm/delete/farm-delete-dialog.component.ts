import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFarm } from '../farm.model';
import { FarmService } from '../service/farm.service';

@Component({
  templateUrl: './farm-delete-dialog.component.html',
})
export class FarmDeleteDialogComponent {
  farm?: IFarm;

  constructor(protected farmService: FarmService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.farmService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
