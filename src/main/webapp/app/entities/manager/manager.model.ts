import { UserType } from 'app/entities/enumerations/user-type.model';

export interface IManager {
  id: number;
  token?: string | null;
  userType?: UserType | null;
}

export type NewManager = Omit<IManager, 'id'> & { id: null };
