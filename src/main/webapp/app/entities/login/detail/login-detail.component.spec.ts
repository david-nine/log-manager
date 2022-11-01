import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoginDetailComponent } from './login-detail.component';

describe('Login Management Detail Component', () => {
  let comp: LoginDetailComponent;
  let fixture: ComponentFixture<LoginDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ login: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoginDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoginDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load login on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.login).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
