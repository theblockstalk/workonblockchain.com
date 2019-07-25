import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProgressbarComponent } from './candidate-progressbar.component';

describe('CandidateProgressbarComponent', () => {
  let component: CandidateProgressbarComponent;
  let fixture: ComponentFixture<CandidateProgressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
