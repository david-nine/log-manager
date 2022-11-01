import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FormattedLogFormService, FormattedLogFormGroup } from './formatted-log-form.service';
import { IFormattedLog } from '../formatted-log.model';
import { FormattedLogService } from '../service/formatted-log.service';

@Component({
  selector: 'jhi-formatted-log-update',
  templateUrl: './formatted-log-update.component.html',
})
export class FormattedLogUpdateComponent implements OnInit {
  isSaving = false;
  formattedLog: IFormattedLog | null = null;

  editForm: FormattedLogFormGroup = this.formattedLogFormService.createFormattedLogFormGroup();

  constructor(
    protected formattedLogService: FormattedLogService,
    protected formattedLogFormService: FormattedLogFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formattedLog }) => {
      this.formattedLog = formattedLog;
      if (formattedLog) {
        this.updateForm(formattedLog);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formattedLog = this.formattedLogFormService.getFormattedLog(this.editForm);
    if (formattedLog.id !== null) {
      this.subscribeToSaveResponse(this.formattedLogService.update(formattedLog));
    } else {
      this.subscribeToSaveResponse(this.formattedLogService.create(formattedLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormattedLog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(formattedLog: IFormattedLog): void {
    this.formattedLog = formattedLog;
    this.formattedLogFormService.resetForm(this.editForm, formattedLog);
  }
}
