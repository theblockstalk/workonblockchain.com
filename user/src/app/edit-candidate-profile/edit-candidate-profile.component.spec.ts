import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCandidateProfileComponent } from './edit-candidate-profile.component';

describe('EditCandidateProfileComponent', () => {
  let component: EditCandidateProfileComponent;
  let fixture: ComponentFixture<EditCandidateProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCandidateProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCandidateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
