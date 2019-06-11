import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialExperienceComponent } from './commercial-experience.component';

describe('CommercialExperienceComponent', () => {
  let component: CommercialExperienceComponent;
  let fixture: ComponentFixture<CommercialExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercialExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
