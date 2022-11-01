import { IManager } from 'app/entities/manager/manager.model';
import { ICompany } from 'app/entities/company/company.model';

export interface IEmployee {
  id: number;
  name?: string | null;
  registration?: string | null;
  hostname?: string | null;
  workloadMinutes?: number | null;
  manager?: Pick<IManager, 'id'> | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
