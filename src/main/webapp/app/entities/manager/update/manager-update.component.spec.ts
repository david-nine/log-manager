import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ManagerFormService } from './manager-form.service';
import { ManagerService } from '../service/manager.service';
import { IManager } from '../manager.model';

import { ManagerUpdateComponent } from './manager-update.component';

describe('Manager Management Update Component', () => {
  let comp: ManagerUpdateComponent;
  let fixture: ComponentFixture<ManagerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let managerFormService: ManagerFormService;
  let managerService: ManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ManagerUpdateComponent],
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
      .overrideTemplate(ManagerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ManagerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    managerFormService = TestBed.inject(ManagerFormService);
    managerService = TestBed.inject(ManagerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const manager: IManager = { id: 456 };

      activatedRoute.data = of({ manager });
      comp.ngOnInit();

      expect(comp.manager).toEqual(manager);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManager>>();
      const manager = { id: 123 };
      jest.spyOn(managerFormService, 'getManager').mockReturnValue(manager);
      jest.spyOn(managerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manager }));
      saveSubject.complete();

      // THEN
      expect(managerFormService.getManager).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(managerService.update).toHaveBeenCalledWith(expect.objectContaining(manager));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManager>>();
      const manager = { id: 123 };
      jest.spyOn(managerFormService, 'getManager').mockReturnValue({ id: null });
      jest.spyOn(managerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manager: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manager }));
      saveSubject.complete();

      // THEN
      expect(managerFormService.getManager).toHaveBeenCalled();
      expect(managerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManager>>();
      const manager = { id: 123 };
      jest.spyOn(managerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(managerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
