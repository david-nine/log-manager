import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FormattedLogFormService } from './formatted-log-form.service';
import { FormattedLogService } from '../service/formatted-log.service';
import { IFormattedLog } from '../formatted-log.model';

import { FormattedLogUpdateComponent } from './formatted-log-update.component';

describe('FormattedLog Management Update Component', () => {
  let comp: FormattedLogUpdateComponent;
  let fixture: ComponentFixture<FormattedLogUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let formattedLogFormService: FormattedLogFormService;
  let formattedLogService: FormattedLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FormattedLogUpdateComponent],
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
      .overrideTemplate(FormattedLogUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FormattedLogUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formattedLogFormService = TestBed.inject(FormattedLogFormService);
    formattedLogService = TestBed.inject(FormattedLogService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const formattedLog: IFormattedLog = { id: 456 };

      activatedRoute.data = of({ formattedLog });
      comp.ngOnInit();

      expect(comp.formattedLog).toEqual(formattedLog);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormattedLog>>();
      const formattedLog = { id: 123 };
      jest.spyOn(formattedLogFormService, 'getFormattedLog').mockReturnValue(formattedLog);
      jest.spyOn(formattedLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formattedLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formattedLog }));
      saveSubject.complete();

      // THEN
      expect(formattedLogFormService.getFormattedLog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(formattedLogService.update).toHaveBeenCalledWith(expect.objectContaining(formattedLog));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormattedLog>>();
      const formattedLog = { id: 123 };
      jest.spyOn(formattedLogFormService, 'getFormattedLog').mockReturnValue({ id: null });
      jest.spyOn(formattedLogService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formattedLog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: formattedLog }));
      saveSubject.complete();

      // THEN
      expect(formattedLogFormService.getFormattedLog).toHaveBeenCalled();
      expect(formattedLogService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFormattedLog>>();
      const formattedLog = { id: 123 };
      jest.spyOn(formattedLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ formattedLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(formattedLogService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
