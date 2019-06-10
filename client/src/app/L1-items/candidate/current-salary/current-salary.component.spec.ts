import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSalaryComponent } from './current-salary.component';

describe('CurrentSalaryComponent', () => {
  let component: CurrentSalaryComponent;
  let fixture: ComponentFixture<CurrentSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
