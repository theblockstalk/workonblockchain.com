import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanyDetailComponent } from './admin-company-detail.component';

describe('AdminCompanyDetailComponent', () => {
  let component: AdminCompanyDetailComponent;
  let fixture: ComponentFixture<AdminCompanyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCompanyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompanyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
