import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateCompanyProfileComponent } from './admin-update-company-profile.component';

describe('AdminUpdateCompanyProfileComponent', () => {
  let component: AdminUpdateCompanyProfileComponent;
  let fixture: ComponentFixture<AdminUpdateCompanyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUpdateCompanyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUpdateCompanyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
