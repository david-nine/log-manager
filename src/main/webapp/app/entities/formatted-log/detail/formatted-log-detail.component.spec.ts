import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FormattedLogDetailComponent } from './formatted-log-detail.component';

describe('FormattedLog Management Detail Component', () => {
  let comp: FormattedLogDetailComponent;
  let fixture: ComponentFixture<FormattedLogDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormattedLogDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ formattedLog: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FormattedLogDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FormattedLogDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load formattedLog on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.formattedLog).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
