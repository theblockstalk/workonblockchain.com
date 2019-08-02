import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateViewComponent } from './candidate-view.component';

describe('CandidateViewComponent', () => {
  let component: CandidateViewComponent;
  let fixture: ComponentFixture<CandidateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
