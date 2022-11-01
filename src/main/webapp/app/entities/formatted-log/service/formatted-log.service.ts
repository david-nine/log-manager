import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormattedLog, NewFormattedLog } from '../formatted-log.model';

export type PartialUpdateFormattedLog = Partial<IFormattedLog> & Pick<IFormattedLog, 'id'>;

type RestOf<T extends IFormattedLog | NewFormattedLog> = Omit<T, 'startDate' | 'endDate' | 'startHour' | 'endHour'> & {
  startDate?: string | null;
  endDate?: string | null;
  startHour?: string | null;
  endHour?: string | null;
};

export type RestFormattedLog = RestOf<IFormattedLog>;

export type NewRestFormattedLog = RestOf<NewFormattedLog>;

export type PartialUpdateRestFormattedLog = RestOf<PartialUpdateFormattedLog>;

export type EntityResponseType = HttpResponse<IFormattedLog>;
export type EntityArrayResponseType = HttpResponse<IFormattedLog[]>;

@Injectable({ providedIn: 'root' })
export class FormattedLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/formatted-logs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formattedLog: NewFormattedLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formattedLog);
    return this.http
      .post<RestFormattedLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(formattedLog: IFormattedLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formattedLog);
    return this.http
      .put<RestFormattedLog>(`${this.resourceUrl}/${this.getFormattedLogIdentifier(formattedLog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(formattedLog: PartialUpdateFormattedLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(formattedLog);
    return this.http
      .patch<RestFormattedLog>(`${this.resourceUrl}/${this.getFormattedLogIdentifier(formattedLog)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFormattedLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFormattedLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFormattedLogIdentifier(formattedLog: Pick<IFormattedLog, 'id'>): number {
    return formattedLog.id;
  }

  compareFormattedLog(o1: Pick<IFormattedLog, 'id'> | null, o2: Pick<IFormattedLog, 'id'> | null): boolean {
    return o1 && o2 ? this.getFormattedLogIdentifier(o1) === this.getFormattedLogIdentifier(o2) : o1 === o2;
  }

  addFormattedLogToCollectionIfMissing<Type extends Pick<IFormattedLog, 'id'>>(
    formattedLogCollection: Type[],
    ...formattedLogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const formattedLogs: Type[] = formattedLogsToCheck.filter(isPresent);
    if (formattedLogs.length > 0) {
      const formattedLogCollectionIdentifiers = formattedLogCollection.map(
        formattedLogItem => this.getFormattedLogIdentifier(formattedLogItem)!
      );
      const formattedLogsToAdd = formattedLogs.filter(formattedLogItem => {
        const formattedLogIdentifier = this.getFormattedLogIdentifier(formattedLogItem);
        if (formattedLogCollectionIdentifiers.includes(formattedLogIdentifier)) {
          return false;
        }
        formattedLogCollectionIdentifiers.push(formattedLogIdentifier);
        return true;
      });
      return [...formattedLogsToAdd, ...formattedLogCollection];
    }
    return formattedLogCollection;
  }

  protected convertDateFromClient<T extends IFormattedLog | NewFormattedLog | PartialUpdateFormattedLog>(formattedLog: T): RestOf<T> {
    return {
      ...formattedLog,
      startDate: formattedLog.startDate?.format(DATE_FORMAT) ?? null,
      endDate: formattedLog.endDate?.format(DATE_FORMAT) ?? null,
      startHour: formattedLog.startHour?.toJSON() ?? null,
      endHour: formattedLog.endHour?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFormattedLog: RestFormattedLog): IFormattedLog {
    return {
      ...restFormattedLog,
      startDate: restFormattedLog.startDate ? dayjs(restFormattedLog.startDate) : undefined,
      endDate: restFormattedLog.endDate ? dayjs(restFormattedLog.endDate) : undefined,
      startHour: restFormattedLog.startHour ? dayjs(restFormattedLog.startHour) : undefined,
      endHour: restFormattedLog.endHour ? dayjs(restFormattedLog.endHour) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFormattedLog>): HttpResponse<IFormattedLog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFormattedLog[]>): HttpResponse<IFormattedLog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
