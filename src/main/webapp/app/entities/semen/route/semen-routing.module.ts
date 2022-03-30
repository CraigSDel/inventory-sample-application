import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SemenComponent } from '../list/semen.component';
import { SemenDetailComponent } from '../detail/semen-detail.component';
import { SemenUpdateComponent } from '../update/semen-update.component';
import { SemenRoutingResolveService } from './semen-routing-resolve.service';

const semenRoute: Routes = [
  {
    path: '',
    component: SemenComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SemenDetailComponent,
    resolve: {
      semen: SemenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SemenUpdateComponent,
    resolve: {
      semen: SemenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SemenUpdateComponent,
    resolve: {
      semen: SemenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(semenRoute)],
  exports: [RouterModule],
})
export class SemenRoutingModule {}
