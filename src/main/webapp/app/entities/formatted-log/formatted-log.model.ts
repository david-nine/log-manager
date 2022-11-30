import dayjs from 'dayjs/esm';

export interface IFormattedLog {
  id: number;
  hostname?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  startHour?: dayjs.Dayjs | null;
  endHour?: dayjs.Dayjs | null;
  status?: string | null;
}

export type NewFormattedLog = Omit<IFormattedLog, 'id'> & { id: null };
