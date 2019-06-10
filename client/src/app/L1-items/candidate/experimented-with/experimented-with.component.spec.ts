import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentedWithComponent } from './experimented-with.component';

describe('ExperimentedWithComponent', () => {
  let component: ExperimentedWithComponent;
  let fixture: ComponentFixture<ExperimentedWithComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentedWithComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentedWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
