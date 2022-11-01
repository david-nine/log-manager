import { UserType } from 'app/entities/enumerations/user-type.model';

import { IManager, NewManager } from './manager.model';

export const sampleWithRequiredData: IManager = {
  id: 22759,
};

export const sampleWithPartialData: IManager = {
  id: 95141,
  token: 'd0c4735b-14fe-4d82-a5eb-aefe89ae4703',
  userType: UserType['ADMIN'],
};

export const sampleWithFullData: IManager = {
  id: 92149,
  token: '27e7c8ed-0496-4266-9e58-6829bcfc61d4',
  userType: UserType['ADMIN'],
};

export const sampleWithNewData: NewManager = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
