import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../manager.test-samples';

import { ManagerFormService } from './manager-form.service';

describe('Manager Form Service', () => {
  let service: ManagerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerFormService);
  });

  describe('Service methods', () => {
    describe('createManagerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createManagerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            token: expect.any(Object),
            userType: expect.any(Object),
          })
        );
      });

      it('passing IManager should create a new form with FormGroup', () => {
        const formGroup = service.createManagerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            token: expect.any(Object),
            userType: expect.any(Object),
          })
        );
      });
    });

    describe('getManager', () => {
      it('should return NewManager for default Manager initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createManagerFormGroup(sampleWithNewData);

        const manager = service.getManager(formGroup) as any;

        expect(manager).toMatchObject(sampleWithNewData);
      });

      it('should return NewManager for empty Manager initial value', () => {
        const formGroup = service.createManagerFormGroup();

        const manager = service.getManager(formGroup) as any;

        expect(manager).toMatchObject({});
      });

      it('should return IManager', () => {
        const formGroup = service.createManagerFormGroup(sampleWithRequiredData);

        const manager = service.getManager(formGroup) as any;

        expect(manager).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IManager should not enable id FormControl', () => {
        const formGroup = service.createManagerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewManager should disable id FormControl', () => {
        const formGroup = service.createManagerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
