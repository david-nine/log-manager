import { ILogin, NewLogin } from './login.model';

export const sampleWithRequiredData: ILogin = {
  id: 46480,
  email: 'Yango72@hotmail.com',
  passsword: 'secondary Chief',
};

export const sampleWithPartialData: ILogin = {
  id: 41205,
  email: 'Fabrcio.Pereira8@gmail.com',
  passsword: 'BordersX',
};

export const sampleWithFullData: ILogin = {
  id: 43678,
  email: 'Roberta9@live.com',
  passsword: 'Berkshire backing functionalities',
};

export const sampleWithNewData: NewLogin = {
  email: 'Paula_Silva46@gmail.com',
  passsword: 'Macio Dynamic programming',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
