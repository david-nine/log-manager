import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LoginComponent } from '../list/login.component';
import { LoginDetailComponent } from '../detail/login-detail.component';
import { LoginUpdateComponent } from '../update/login-update.component';
import { LoginRoutingResolveService } from './login-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const loginRoute: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LoginDetailComponent,
    resolve: {
      login: LoginRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LoginUpdateComponent,
    resolve: {
      login: LoginRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LoginUpdateComponent,
    resolve: {
      login: LoginRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(loginRoute)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
