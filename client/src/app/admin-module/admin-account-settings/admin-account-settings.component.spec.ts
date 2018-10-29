import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountSettingsComponent } from './admin-account-settings.component';

describe('AdminAccountSettingsComponent', () => {
  let component: AdminAccountSettingsComponent;
  let fixture: ComponentFixture<AdminAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
