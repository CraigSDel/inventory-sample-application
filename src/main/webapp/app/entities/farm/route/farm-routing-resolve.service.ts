import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFarm, Farm } from '../farm.model';
import { FarmService } from '../service/farm.service';

@Injectable({ providedIn: 'root' })
export class FarmRoutingResolveService implements Resolve<IFarm> {
  constructor(protected service: FarmService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFarm> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((farm: HttpResponse<Farm>) => {
          if (farm.body) {
            return of(farm.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Farm());
  }
}
