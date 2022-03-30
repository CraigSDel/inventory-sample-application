import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SemenDonorComponent } from '../list/semen-donor.component';
import { SemenDonorDetailComponent } from '../detail/semen-donor-detail.component';
import { SemenDonorUpdateComponent } from '../update/semen-donor-update.component';
import { SemenDonorRoutingResolveService } from './semen-donor-routing-resolve.service';

const semenDonorRoute: Routes = [
  {
    path: '',
    component: SemenDonorComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SemenDonorDetailComponent,
    resolve: {
      semenDonor: SemenDonorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SemenDonorUpdateComponent,
    resolve: {
      semenDonor: SemenDonorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SemenDonorUpdateComponent,
    resolve: {
      semenDonor: SemenDonorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(semenDonorRoute)],
  exports: [RouterModule],
})
export class SemenDonorRoutingModule {}
