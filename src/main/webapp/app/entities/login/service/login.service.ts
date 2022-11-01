import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILogin, NewLogin } from '../login.model';

export type PartialUpdateLogin = Partial<ILogin> & Pick<ILogin, 'id'>;

export type EntityResponseType = HttpResponse<ILogin>;
export type EntityArrayResponseType = HttpResponse<ILogin[]>;

@Injectable({ providedIn: 'root' })
export class LoginService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/logins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(login: NewLogin): Observable<EntityResponseType> {
    return this.http.post<ILogin>(this.resourceUrl, login, { observe: 'response' });
  }

  update(login: ILogin): Observable<EntityResponseType> {
    return this.http.put<ILogin>(`${this.resourceUrl}/${this.getLoginIdentifier(login)}`, login, { observe: 'response' });
  }

  partialUpdate(login: PartialUpdateLogin): Observable<EntityResponseType> {
    return this.http.patch<ILogin>(`${this.resourceUrl}/${this.getLoginIdentifier(login)}`, login, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILogin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILogin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoginIdentifier(login: Pick<ILogin, 'id'>): number {
    return login.id;
  }

  compareLogin(o1: Pick<ILogin, 'id'> | null, o2: Pick<ILogin, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoginIdentifier(o1) === this.getLoginIdentifier(o2) : o1 === o2;
  }

  addLoginToCollectionIfMissing<Type extends Pick<ILogin, 'id'>>(
    loginCollection: Type[],
    ...loginsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const logins: Type[] = loginsToCheck.filter(isPresent);
    if (logins.length > 0) {
      const loginCollectionIdentifiers = loginCollection.map(loginItem => this.getLoginIdentifier(loginItem)!);
      const loginsToAdd = logins.filter(loginItem => {
        const loginIdentifier = this.getLoginIdentifier(loginItem);
        if (loginCollectionIdentifiers.includes(loginIdentifier)) {
          return false;
        }
        loginCollectionIdentifiers.push(loginIdentifier);
        return true;
      });
      return [...loginsToAdd, ...loginCollection];
    }
    return loginCollection;
  }
}
