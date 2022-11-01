import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IManager, NewManager } from '../manager.model';

export type PartialUpdateManager = Partial<IManager> & Pick<IManager, 'id'>;

export type EntityResponseType = HttpResponse<IManager>;
export type EntityArrayResponseType = HttpResponse<IManager[]>;

@Injectable({ providedIn: 'root' })
export class ManagerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/managers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(manager: NewManager): Observable<EntityResponseType> {
    return this.http.post<IManager>(this.resourceUrl, manager, { observe: 'response' });
  }

  update(manager: IManager): Observable<EntityResponseType> {
    return this.http.put<IManager>(`${this.resourceUrl}/${this.getManagerIdentifier(manager)}`, manager, { observe: 'response' });
  }

  partialUpdate(manager: PartialUpdateManager): Observable<EntityResponseType> {
    return this.http.patch<IManager>(`${this.resourceUrl}/${this.getManagerIdentifier(manager)}`, manager, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IManager>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IManager[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getManagerIdentifier(manager: Pick<IManager, 'id'>): number {
    return manager.id;
  }

  compareManager(o1: Pick<IManager, 'id'> | null, o2: Pick<IManager, 'id'> | null): boolean {
    return o1 && o2 ? this.getManagerIdentifier(o1) === this.getManagerIdentifier(o2) : o1 === o2;
  }

  addManagerToCollectionIfMissing<Type extends Pick<IManager, 'id'>>(
    managerCollection: Type[],
    ...managersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const managers: Type[] = managersToCheck.filter(isPresent);
    if (managers.length > 0) {
      const managerCollectionIdentifiers = managerCollection.map(managerItem => this.getManagerIdentifier(managerItem)!);
      const managersToAdd = managers.filter(managerItem => {
        const managerIdentifier = this.getManagerIdentifier(managerItem);
        if (managerCollectionIdentifiers.includes(managerIdentifier)) {
          return false;
        }
        managerCollectionIdentifiers.push(managerIdentifier);
        return true;
      });
      return [...managersToAdd, ...managerCollection];
    }
    return managerCollection;
  }
}
