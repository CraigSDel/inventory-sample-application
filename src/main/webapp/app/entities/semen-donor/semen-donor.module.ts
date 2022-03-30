import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SemenDonorComponent } from './list/semen-donor.component';
import { SemenDonorDetailComponent } from './detail/semen-donor-detail.component';
import { SemenDonorUpdateComponent } from './update/semen-donor-update.component';
import { SemenDonorDeleteDialogComponent } from './delete/semen-donor-delete-dialog.component';
import { SemenDonorRoutingModule } from './route/semen-donor-routing.module';

@NgModule({
  imports: [SharedModule, SemenDonorRoutingModule],
  declarations: [SemenDonorComponent, SemenDonorDetailComponent, SemenDonorUpdateComponent, SemenDonorDeleteDialogComponent],
  entryComponents: [SemenDonorDeleteDialogComponent],
})
export class SemenDonorModule {}
