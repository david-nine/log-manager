import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFormattedLog } from '../formatted-log.model';
import { FormattedLogService } from '../service/formatted-log.service';

@Injectable({ providedIn: 'root' })
export class FormattedLogRoutingResolveService implements Resolve<IFormattedLog | null> {
  constructor(protected service: FormattedLogService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormattedLog | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((formattedLog: HttpResponse<IFormattedLog>) => {
          if (formattedLog.body) {
            return of(formattedLog.body);
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
