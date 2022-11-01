import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FormattedLogComponent } from './list/formatted-log.component';
import { FormattedLogDetailComponent } from './detail/formatted-log-detail.component';
import { FormattedLogUpdateComponent } from './update/formatted-log-update.component';
import { FormattedLogDeleteDialogComponent } from './delete/formatted-log-delete-dialog.component';
import { FormattedLogRoutingModule } from './route/formatted-log-routing.module';

@NgModule({
  imports: [SharedModule, FormattedLogRoutingModule],
  declarations: [FormattedLogComponent, FormattedLogDetailComponent, FormattedLogUpdateComponent, FormattedLogDeleteDialogComponent],
})
export class FormattedLogModule {}
