import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: 7813,
  name: 'transmitting',
  registration: 'scale Mexican Administrator',
  hostname: 'Granito',
};

export const sampleWithPartialData: IEmployee = {
  id: 28480,
  name: 'e-tailers internet Rodovia',
  registration: 'Pizza paradigm',
  hostname: 'Accountability invoice Berkshire',
};

export const sampleWithFullData: IEmployee = {
  id: 95971,
  name: 'user-centric invoice',
  registration: 'pixel Finlândia',
  hostname: 'Iranian embrace',
  workloadMinutes: 26733,
};

export const sampleWithNewData: NewEmployee = {
  name: 'haptic haptic deposit',
  registration: 'Música Rua',
  hostname: 'Account Lesotho Bhutanese',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
