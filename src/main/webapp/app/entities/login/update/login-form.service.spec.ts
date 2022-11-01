import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../login.test-samples';

import { LoginFormService } from './login-form.service';

describe('Login Form Service', () => {
  let service: LoginFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginFormService);
  });

  describe('Service methods', () => {
    describe('createLoginFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLoginFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            email: expect.any(Object),
            passsword: expect.any(Object),
            manager: expect.any(Object),
          })
        );
      });

      it('passing ILogin should create a new form with FormGroup', () => {
        const formGroup = service.createLoginFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            email: expect.any(Object),
            passsword: expect.any(Object),
            manager: expect.any(Object),
          })
        );
      });
    });

    describe('getLogin', () => {
      it('should return NewLogin for default Login initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLoginFormGroup(sampleWithNewData);

        const login = service.getLogin(formGroup) as any;

        expect(login).toMatchObject(sampleWithNewData);
      });

      it('should return NewLogin for empty Login initial value', () => {
        const formGroup = service.createLoginFormGroup();

        const login = service.getLogin(formGroup) as any;

        expect(login).toMatchObject({});
      });

      it('should return ILogin', () => {
        const formGroup = service.createLoginFormGroup(sampleWithRequiredData);

        const login = service.getLogin(formGroup) as any;

        expect(login).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILogin should not enable id FormControl', () => {
        const formGroup = service.createLoginFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLogin should disable id FormControl', () => {
        const formGroup = service.createLoginFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
