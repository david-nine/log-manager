import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FormattedLogComponent } from '../list/formatted-log.component';
import { FormattedLogDetailComponent } from '../detail/formatted-log-detail.component';
import { FormattedLogUpdateComponent } from '../update/formatted-log-update.component';
import { FormattedLogRoutingResolveService } from './formatted-log-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const formattedLogRoute: Routes = [
  {
    path: '',
    component: FormattedLogComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormattedLogDetailComponent,
    resolve: {
      formattedLog: FormattedLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormattedLogUpdateComponent,
    resolve: {
      formattedLog: FormattedLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormattedLogUpdateComponent,
    resolve: {
      formattedLog: FormattedLogRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(formattedLogRoute)],
  exports: [RouterModule],
})
export class FormattedLogRoutingModule {}
