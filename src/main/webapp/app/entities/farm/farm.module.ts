import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FarmComponent } from './list/farm.component';
import { FarmDetailComponent } from './detail/farm-detail.component';
import { FarmUpdateComponent } from './update/farm-update.component';
import { FarmDeleteDialogComponent } from './delete/farm-delete-dialog.component';
import { FarmRoutingModule } from './route/farm-routing.module';

@NgModule({
  imports: [SharedModule, FarmRoutingModule],
  declarations: [FarmComponent, FarmDetailComponent, FarmUpdateComponent, FarmDeleteDialogComponent],
  entryComponents: [FarmDeleteDialogComponent],
})
export class FarmModule {}
