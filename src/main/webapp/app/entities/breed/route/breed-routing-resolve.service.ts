import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBreed, Breed } from '../breed.model';
import { BreedService } from '../service/breed.service';

@Injectable({ providedIn: 'root' })
export class BreedRoutingResolveService implements Resolve<IBreed> {
  constructor(protected service: BreedService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBreed> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((breed: HttpResponse<Breed>) => {
          if (breed.body) {
            return of(breed.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Breed());
  }
}
