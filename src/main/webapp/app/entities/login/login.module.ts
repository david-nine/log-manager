import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LoginComponent } from './list/login.component';
import { LoginDetailComponent } from './detail/login-detail.component';
import { LoginUpdateComponent } from './update/login-update.component';
import { LoginDeleteDialogComponent } from './delete/login-delete-dialog.component';
import { LoginRoutingModule } from './route/login-routing.module';

@NgModule({
  imports: [SharedModule, LoginRoutingModule],
  declarations: [LoginComponent, LoginDetailComponent, LoginUpdateComponent, LoginDeleteDialogComponent],
})
export class LoginModule {}
