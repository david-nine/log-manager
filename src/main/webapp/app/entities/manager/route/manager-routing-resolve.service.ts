import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IManager } from '../manager.model';
import { ManagerService } from '../service/manager.service';

@Injectable({ providedIn: 'root' })
export class ManagerRoutingResolveService implements Resolve<IManager | null> {
  constructor(protected service: ManagerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IManager | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((manager: HttpResponse<IManager>) => {
          if (manager.body) {
            return of(manager.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
