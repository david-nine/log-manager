import { IManager } from 'app/entities/manager/manager.model';

export interface ILogin {
  id: number;
  email?: string | null;
  passsword?: string | null;
  manager?: Pick<IManager, 'id'> | null;
}

export type NewLogin = Omit<ILogin, 'id'> & { id: null };
