import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'company',
        data: { pageTitle: 'logManagerApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'logManagerApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'formatted-log',
        data: { pageTitle: 'logManagerApp.formattedLog.home.title' },
        loadChildren: () => import('./formatted-log/formatted-log.module').then(m => m.FormattedLogModule),
      },
      {
        path: 'manager',
        data: { pageTitle: 'logManagerApp.manager.home.title' },
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
      },
      {
        path: 'login',
        data: { pageTitle: 'logManagerApp.login.home.title' },
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
