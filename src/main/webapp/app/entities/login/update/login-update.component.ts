import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LoginFormService, LoginFormGroup } from './login-form.service';
import { ILogin } from '../login.model';
import { LoginService } from '../service/login.service';
import { IManager } from 'app/entities/manager/manager.model';
import { ManagerService } from 'app/entities/manager/service/manager.service';

@Component({
  selector: 'jhi-login-update',
  templateUrl: './login-update.component.html',
})
export class LoginUpdateComponent implements OnInit {
  isSaving = false;
  login: ILogin | null = null;

  managersSharedCollection: IManager[] = [];

  editForm: LoginFormGroup = this.loginFormService.createLoginFormGroup();

  constructor(
    protected loginService: LoginService,
    protected loginFormService: LoginFormService,
    protected managerService: ManagerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareManager = (o1: IManager | null, o2: IManager | null): boolean => this.managerService.compareManager(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ login }) => {
      this.login = login;
      if (login) {
        this.updateForm(login);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const login = this.loginFormService.getLogin(this.editForm);
    if (login.id !== null) {
      this.subscribeToSaveResponse(this.loginService.update(login));
    } else {
      this.subscribeToSaveResponse(this.loginService.create(login));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILogin>>): void {
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

  protected updateForm(login: ILogin): void {
    this.login = login;
    this.loginFormService.resetForm(this.editForm, login);

    this.managersSharedCollection = this.managerService.addManagerToCollectionIfMissing<IManager>(
      this.managersSharedCollection,
      login.manager
    );
  }

  protected loadRelationshipsOptions(): void {
    this.managerService
      .query()
      .pipe(map((res: HttpResponse<IManager[]>) => res.body ?? []))
      .pipe(map((managers: IManager[]) => this.managerService.addManagerToCollectionIfMissing<IManager>(managers, this.login?.manager)))
      .subscribe((managers: IManager[]) => (this.managersSharedCollection = managers));
  }
}
