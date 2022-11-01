import dayjs from 'dayjs/esm';

import { IFormattedLog, NewFormattedLog } from './formatted-log.model';

export const sampleWithRequiredData: IFormattedLog = {
  id: 33951,
  hostname: 'background RSS neural',
  startDate: dayjs('2022-10-31'),
  endDate: dayjs('2022-10-31'),
  startHour: dayjs('2022-10-31T13:31'),
  endHour: dayjs('2022-10-31T08:57'),
};

export const sampleWithPartialData: IFormattedLog = {
  id: 58745,
  hostname: 'transmitter digital attitude-oriented',
  startDate: dayjs('2022-10-31'),
  endDate: dayjs('2022-10-31'),
  startHour: dayjs('2022-10-31T19:58'),
  endHour: dayjs('2022-10-31T04:48'),
};

export const sampleWithFullData: IFormattedLog = {
  id: 98563,
  hostname: 'Legacy Creative',
  startDate: dayjs('2022-10-31'),
  endDate: dayjs('2022-10-31'),
  startHour: dayjs('2022-10-31T13:09'),
  endHour: dayjs('2022-10-31T12:36'),
};

export const sampleWithNewData: NewFormattedLog = {
  hostname: 'Salada',
  startDate: dayjs('2022-10-31'),
  endDate: dayjs('2022-10-31'),
  startHour: dayjs('2022-10-31T01:24'),
  endHour: dayjs('2022-10-31T08:40'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
