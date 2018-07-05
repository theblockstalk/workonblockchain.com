import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCandidateDetailComponent } from './admin-candidate-detail.component';

describe('AdminCandidateDetailComponent', () => {
  let component: AdminCandidateDetailComponent;
  let fixture: ComponentFixture<AdminCandidateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCandidateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCandidateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
