import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SemenComponent } from './list/semen.component';
import { SemenDetailComponent } from './detail/semen-detail.component';
import { SemenUpdateComponent } from './update/semen-update.component';
import { SemenDeleteDialogComponent } from './delete/semen-delete-dialog.component';
import { SemenRoutingModule } from './route/semen-routing.module';

@NgModule({
  imports: [SharedModule, SemenRoutingModule],
  declarations: [SemenComponent, SemenDetailComponent, SemenUpdateComponent, SemenDeleteDialogComponent],
  entryComponents: [SemenDeleteDialogComponent],
})
export class SemenModule {}
