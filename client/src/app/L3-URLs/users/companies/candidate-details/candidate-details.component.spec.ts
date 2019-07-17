import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailsComponent } from './candidate-details.component';

describe('CandidateDetailsComponent', () => {
  let component: CandidateDetailsComponent;
  let fixture: ComponentFixture<CandidateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
