import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearOfExperienceComponent } from './year-of-experience.component';

describe('YearOfExperienceComponent', () => {
  let component: YearOfExperienceComponent;
  let fixture: ComponentFixture<YearOfExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearOfExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearOfExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
