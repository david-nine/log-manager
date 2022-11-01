import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../formatted-log.test-samples';

import { FormattedLogFormService } from './formatted-log-form.service';

describe('FormattedLog Form Service', () => {
  let service: FormattedLogFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormattedLogFormService);
  });

  describe('Service methods', () => {
    describe('createFormattedLogFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFormattedLogFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            hostname: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            startHour: expect.any(Object),
            endHour: expect.any(Object),
          })
        );
      });

      it('passing IFormattedLog should create a new form with FormGroup', () => {
        const formGroup = service.createFormattedLogFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            hostname: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            startHour: expect.any(Object),
            endHour: expect.any(Object),
          })
        );
      });
    });

    describe('getFormattedLog', () => {
      it('should return NewFormattedLog for default FormattedLog initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFormattedLogFormGroup(sampleWithNewData);

        const formattedLog = service.getFormattedLog(formGroup) as any;

        expect(formattedLog).toMatchObject(sampleWithNewData);
      });

      it('should return NewFormattedLog for empty FormattedLog initial value', () => {
        const formGroup = service.createFormattedLogFormGroup();

        const formattedLog = service.getFormattedLog(formGroup) as any;

        expect(formattedLog).toMatchObject({});
      });

      it('should return IFormattedLog', () => {
        const formGroup = service.createFormattedLogFormGroup(sampleWithRequiredData);

        const formattedLog = service.getFormattedLog(formGroup) as any;

        expect(formattedLog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFormattedLog should not enable id FormControl', () => {
        const formGroup = service.createFormattedLogFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFormattedLog should disable id FormControl', () => {
        const formGroup = service.createFormattedLogFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
