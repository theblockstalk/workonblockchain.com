import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCandidateSearchComponent } from './admin-candidate-search.component';

describe('AdminCandidateSearchComponent', () => {
  let component: AdminCandidateSearchComponent;
  let fixture: ComponentFixture<AdminCandidateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCandidateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCandidateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
