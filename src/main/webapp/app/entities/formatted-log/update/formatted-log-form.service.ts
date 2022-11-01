import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFormattedLog, NewFormattedLog } from '../formatted-log.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFormattedLog for edit and NewFormattedLogFormGroupInput for create.
 */
type FormattedLogFormGroupInput = IFormattedLog | PartialWithRequiredKeyOf<NewFormattedLog>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFormattedLog | NewFormattedLog> = Omit<T, 'startHour' | 'endHour'> & {
  startHour?: string | null;
  endHour?: string | null;
};

type FormattedLogFormRawValue = FormValueOf<IFormattedLog>;

type NewFormattedLogFormRawValue = FormValueOf<NewFormattedLog>;

type FormattedLogFormDefaults = Pick<NewFormattedLog, 'id' | 'startHour' | 'endHour'>;

type FormattedLogFormGroupContent = {
  id: FormControl<FormattedLogFormRawValue['id'] | NewFormattedLog['id']>;
  hostname: FormControl<FormattedLogFormRawValue['hostname']>;
  startDate: FormControl<FormattedLogFormRawValue['startDate']>;
  endDate: FormControl<FormattedLogFormRawValue['endDate']>;
  startHour: FormControl<FormattedLogFormRawValue['startHour']>;
  endHour: FormControl<FormattedLogFormRawValue['endHour']>;
};

export type FormattedLogFormGroup = FormGroup<FormattedLogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FormattedLogFormService {
  createFormattedLogFormGroup(formattedLog: FormattedLogFormGroupInput = { id: null }): FormattedLogFormGroup {
    const formattedLogRawValue = this.convertFormattedLogToFormattedLogRawValue({
      ...this.getFormDefaults(),
      ...formattedLog,
    });
    return new FormGroup<FormattedLogFormGroupContent>({
      id: new FormControl(
        { value: formattedLogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      hostname: new FormControl(formattedLogRawValue.hostname, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(formattedLogRawValue.startDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(formattedLogRawValue.endDate, {
        validators: [Validators.required],
      }),
      startHour: new FormControl(formattedLogRawValue.startHour, {
        validators: [Validators.required],
      }),
      endHour: new FormControl(formattedLogRawValue.endHour, {
        validators: [Validators.required],
      }),
    });
  }

  getFormattedLog(form: FormattedLogFormGroup): IFormattedLog | NewFormattedLog {
    return this.convertFormattedLogRawValueToFormattedLog(form.getRawValue() as FormattedLogFormRawValue | NewFormattedLogFormRawValue);
  }

  resetForm(form: FormattedLogFormGroup, formattedLog: FormattedLogFormGroupInput): void {
    const formattedLogRawValue = this.convertFormattedLogToFormattedLogRawValue({ ...this.getFormDefaults(), ...formattedLog });
    form.reset(
      {
        ...formattedLogRawValue,
        id: { value: formattedLogRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FormattedLogFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startHour: currentTime,
      endHour: currentTime,
    };
  }

  private convertFormattedLogRawValueToFormattedLog(
    rawFormattedLog: FormattedLogFormRawValue | NewFormattedLogFormRawValue
  ): IFormattedLog | NewFormattedLog {
    return {
      ...rawFormattedLog,
      startHour: dayjs(rawFormattedLog.startHour, DATE_TIME_FORMAT),
      endHour: dayjs(rawFormattedLog.endHour, DATE_TIME_FORMAT),
    };
  }

  private convertFormattedLogToFormattedLogRawValue(
    formattedLog: IFormattedLog | (Partial<NewFormattedLog> & FormattedLogFormDefaults)
  ): FormattedLogFormRawValue | PartialWithRequiredKeyOf<NewFormattedLogFormRawValue> {
    return {
      ...formattedLog,
      startHour: formattedLog.startHour ? formattedLog.startHour.format(DATE_TIME_FORMAT) : undefined,
      endHour: formattedLog.endHour ? formattedLog.endHour.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
