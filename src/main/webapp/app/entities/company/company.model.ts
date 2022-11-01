export interface ICompany {
  id: number;
  name?: string | null;
  cnpj?: string | null;
  realTime?: boolean | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
