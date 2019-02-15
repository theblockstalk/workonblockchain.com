import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateVerifyEmailComponent } from './candidate-verify-email.component';

describe('CandidateVerifyEmailComponent', () => {
  let component: CandidateVerifyEmailComponent;
  let fixture: ComponentFixture<CandidateVerifyEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateVerifyEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
