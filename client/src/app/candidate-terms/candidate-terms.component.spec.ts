import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTermsComponent } from './candidate-terms.component';

describe('CandidateTermsComponent', () => {
  let component: CandidateTermsComponent;
  let fixture: ComponentFixture<CandidateTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
