import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BreedComponent } from '../list/breed.component';
import { BreedDetailComponent } from '../detail/breed-detail.component';
import { BreedUpdateComponent } from '../update/breed-update.component';
import { BreedRoutingResolveService } from './breed-routing-resolve.service';

const breedRoute: Routes = [
  {
    path: '',
    component: BreedComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BreedDetailComponent,
    resolve: {
      breed: BreedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BreedUpdateComponent,
    resolve: {
      breed: BreedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BreedUpdateComponent,
    resolve: {
      breed: BreedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(breedRoute)],
  exports: [RouterModule],
})
export class BreedRoutingModule {}
