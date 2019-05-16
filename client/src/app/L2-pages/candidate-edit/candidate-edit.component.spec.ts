import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEditComponent } from './candidate-edit.component';

describe('CandidateEditComponent', () => {
  let component: CandidateEditComponent;
  let fixture: ComponentFixture<CandidateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
