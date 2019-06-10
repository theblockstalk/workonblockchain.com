import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectComponent } from './time-select.component';

describe('TimeSelectComponent', () => {
  let component: TimeSelectComponent;
  let fixture: ComponentFixture<TimeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
