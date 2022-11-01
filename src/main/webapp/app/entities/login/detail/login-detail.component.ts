import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILogin } from '../login.model';

@Component({
  selector: 'jhi-login-detail',
  templateUrl: './login-detail.component.html',
})
export class LoginDetailComponent implements OnInit {
  login: ILogin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ login }) => {
      this.login = login;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
