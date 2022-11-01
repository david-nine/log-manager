import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoginFormService } from './login-form.service';
import { LoginService } from '../service/login.service';
import { ILogin } from '../login.model';
import { IManager } from 'app/entities/manager/manager.model';
import { ManagerService } from 'app/entities/manager/service/manager.service';

import { LoginUpdateComponent } from './login-update.component';

describe('Login Management Update Component', () => {
  let comp: LoginUpdateComponent;
  let fixture: ComponentFixture<LoginUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loginFormService: LoginFormService;
  let loginService: LoginService;
  let managerService: ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoginUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LoginUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoginUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loginFormService = TestBed.inject(LoginFormService);
    loginService = TestBed.inject(LoginService);
    managerService = TestBed.inject(ManagerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Manager query and add missing value', () => {
      const login: ILogin = { id: 456 };
      const manager: IManager = { id: 92433 };
      login.manager = manager;

      const managerCollection: IManager[] = [{ id: 57364 }];
      jest.spyOn(managerService, 'query').mockReturnValue(of(new HttpResponse({ body: managerCollection })));
      const additionalManagers = [manager];
      const expectedCollection: IManager[] = [...additionalManagers, ...managerCollection];
      jest.spyOn(managerService, 'addManagerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ login });
      comp.ngOnInit();

      expect(managerService.query).toHaveBeenCalled();
      expect(managerService.addManagerToCollectionIfMissing).toHaveBeenCalledWith(
        managerCollection,
        ...additionalManagers.map(expect.objectContaining)
      );
      expect(comp.managersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const login: ILogin = { id: 456 };
      const manager: IManager = { id: 55308 };
      login.manager = manager;

      activatedRoute.data = of({ login });
      comp.ngOnInit();

      expect(comp.managersSharedCollection).toContain(manager);
      expect(comp.login).toEqual(login);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILogin>>();
      const login = { id: 123 };
      jest.spyOn(loginFormService, 'getLogin').mockReturnValue(login);
      jest.spyOn(loginService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ login });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: login }));
      saveSubject.complete();

      // THEN
      expect(loginFormService.getLogin).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loginService.update).toHaveBeenCalledWith(expect.objectContaining(login));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILogin>>();
      const login = { id: 123 };
      jest.spyOn(loginFormService, 'getLogin').mockReturnValue({ id: null });
      jest.spyOn(loginService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ login: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: login }));
      saveSubject.complete();

      // THEN
      expect(loginFormService.getLogin).toHaveBeenCalled();
      expect(loginService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILogin>>();
      const login = { id: 123 };
      jest.spyOn(loginService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ login });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loginService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareManager', () => {
      it('Should forward to managerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(managerService, 'compareManager');
        comp.compareManager(entity, entity2);
        expect(managerService.compareManager).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
