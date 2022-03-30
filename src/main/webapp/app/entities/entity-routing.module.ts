import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        data: { pageTitle: 'inventorySampleApplicationApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'location',
        data: { pageTitle: 'inventorySampleApplicationApp.location.home.title' },
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'farm',
        data: { pageTitle: 'inventorySampleApplicationApp.farm.home.title' },
        loadChildren: () => import('./farm/farm.module').then(m => m.FarmModule),
      },
      {
        path: 'breed',
        data: { pageTitle: 'inventorySampleApplicationApp.breed.home.title' },
        loadChildren: () => import('./breed/breed.module').then(m => m.BreedModule),
      },
      {
        path: 'semen-donor',
        data: { pageTitle: 'inventorySampleApplicationApp.semenDonor.home.title' },
        loadChildren: () => import('./semen-donor/semen-donor.module').then(m => m.SemenDonorModule),
      },
      {
        path: 'semen',
        data: { pageTitle: 'inventorySampleApplicationApp.semen.home.title' },
        loadChildren: () => import('./semen/semen.module').then(m => m.SemenModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
