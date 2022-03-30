import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FarmComponent } from '../list/farm.component';
import { FarmDetailComponent } from '../detail/farm-detail.component';
import { FarmUpdateComponent } from '../update/farm-update.component';
import { FarmRoutingResolveService } from './farm-routing-resolve.service';

const farmRoute: Routes = [
  {
    path: '',
    component: FarmComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FarmDetailComponent,
    resolve: {
      farm: FarmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FarmUpdateComponent,
    resolve: {
      farm: FarmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FarmUpdateComponent,
    resolve: {
      farm: FarmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(farmRoute)],
  exports: [RouterModule],
})
export class FarmRoutingModule {}
