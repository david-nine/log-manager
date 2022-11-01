import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILogin } from '../login.model';
import { LoginService } from '../service/login.service';

@Injectable({ providedIn: 'root' })
export class LoginRoutingResolveService implements Resolve<ILogin | null> {
  constructor(protected service: LoginService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILogin | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((login: HttpResponse<ILogin>) => {
          if (login.body) {
            return of(login.body);
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
