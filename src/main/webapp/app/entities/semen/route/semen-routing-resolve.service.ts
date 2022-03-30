import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISemen, Semen } from '../semen.model';
import { SemenService } from '../service/semen.service';

@Injectable({ providedIn: 'root' })
export class SemenRoutingResolveService implements Resolve<ISemen> {
  constructor(protected service: SemenService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISemen> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((semen: HttpResponse<Semen>) => {
          if (semen.body) {
            return of(semen.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Semen());
  }
}
