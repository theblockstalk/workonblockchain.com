import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyVerifyEmailComponent } from './company-verify-email.component';

describe('CompanyVerifyEmailComponent', () => {
  let component: CompanyVerifyEmailComponent;
  let fixture: ComponentFixture<CompanyVerifyEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyVerifyEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
