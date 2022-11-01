import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: 32440,
  name: 'Dinamarca Sergipe',
  cnpj: undefined,
};

export const sampleWithPartialData: ICompany = {
  id: 1226,
  name: 'Granito',
  cnpj: undefined,
};

export const sampleWithFullData: ICompany = {
  id: 8952,
  name: 'Avenida',
  cnpj: undefined,
  realTime: false,
};

export const sampleWithNewData: NewCompany = {
  name: 'Austrália',
  cnpj: undefined,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
