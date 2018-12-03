import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateCandidateProfileComponent } from './admin-update-candidate-profile.component';

describe('AdminUpdateCandidateProfileComponent', () => {
  let component: AdminUpdateCandidateProfileComponent;
  let fixture: ComponentFixture<AdminUpdateCandidateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUpdateCandidateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUpdateCandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
