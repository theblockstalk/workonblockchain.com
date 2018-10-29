import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompanySearchComponent } from './admin-company-search.component';

describe('AdminCompanySearchComponent', () => {
  let component: AdminCompanySearchComponent;
  let fixture: ComponentFixture<AdminCompanySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCompanySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCompanySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
