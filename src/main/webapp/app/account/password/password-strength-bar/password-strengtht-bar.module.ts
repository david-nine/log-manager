import { NgModule } from '@angular/core';
import { PasswordStrengthBarComponent } from './password-strength-bar.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  exports: [PasswordStrengthBarComponent],
  declarations: [PasswordStrengthBarComponent],
})
export class PasswordStrengthtBarModule {}
