import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormattedLog } from '../formatted-log.model';
import { FormattedLogService } from '../service/formatted-log.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './formatted-log-delete-dialog.component.html',
})
export class FormattedLogDeleteDialogComponent {
  formattedLog?: IFormattedLog;

  constructor(protected formattedLogService: FormattedLogService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formattedLogService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
