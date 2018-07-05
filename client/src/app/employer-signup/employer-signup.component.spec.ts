import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSignupComponent } from './employer-signup.component';

describe('EmployerSignupComponent', () => {
  let component: EmployerSignupComponent;
  let fixture: ComponentFixture<EmployerSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
