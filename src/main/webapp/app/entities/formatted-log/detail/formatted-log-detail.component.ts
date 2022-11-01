import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormattedLog } from '../formatted-log.model';

@Component({
  selector: 'jhi-formatted-log-detail',
  templateUrl: './formatted-log-detail.component.html',
})
export class FormattedLogDetailComponent implements OnInit {
  formattedLog: IFormattedLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formattedLog }) => {
      this.formattedLog = formattedLog;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
