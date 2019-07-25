import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandJobActivityComponent } from './cand-job-activity.component';

describe('CandJobActivityComponent', () => {
  let component: CandJobActivityComponent;
  let fixture: ComponentFixture<CandJobActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandJobActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandJobActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
