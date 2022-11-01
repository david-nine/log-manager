import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILogin, NewLogin } from '../login.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILogin for edit and NewLoginFormGroupInput for create.
 */
type LoginFormGroupInput = ILogin | PartialWithRequiredKeyOf<NewLogin>;

type LoginFormDefaults = Pick<NewLogin, 'id'>;

type LoginFormGroupContent = {
  id: FormControl<ILogin['id'] | NewLogin['id']>;
  email: FormControl<ILogin['email']>;
  passsword: FormControl<ILogin['passsword']>;
  manager: FormControl<ILogin['manager']>;
};

export type LoginFormGroup = FormGroup<LoginFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoginFormService {
  createLoginFormGroup(login: LoginFormGroupInput = { id: null }): LoginFormGroup {
    const loginRawValue = {
      ...this.getFormDefaults(),
      ...login,
    };
    return new FormGroup<LoginFormGroupContent>({
      id: new FormControl(
        { value: loginRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      email: new FormControl(loginRawValue.email, {
        validators: [Validators.required],
      }),
      passsword: new FormControl(loginRawValue.passsword, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      manager: new FormControl(loginRawValue.manager),
    });
  }

  getLogin(form: LoginFormGroup): ILogin | NewLogin {
    return form.getRawValue() as ILogin | NewLogin;
  }

  resetForm(form: LoginFormGroup, login: LoginFormGroupInput): void {
    const loginRawValue = { ...this.getFormDefaults(), ...login };
    form.reset(
      {
        ...loginRawValue,
        id: { value: loginRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LoginFormDefaults {
    return {
      id: null,
    };
  }
}
