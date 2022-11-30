import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ActivateComponent } from './activate/activate.component';
import { PasswordComponent } from './password/password.component';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';
import { PasswordResetFinishComponent } from './password-reset/finish/password-reset-finish.component';
import { SettingsComponent } from './settings/settings.component';
import { accountState } from './account.route';
import { PasswordStrengthtBarModule } from './password/password-strength-bar/password-strengtht-bar.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(accountState), PasswordStrengthtBarModule],
  declarations: [
    ActivateComponent,
    RegisterComponent,
    PasswordComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SettingsComponent,
  ],
})
export class AccountModule {}
