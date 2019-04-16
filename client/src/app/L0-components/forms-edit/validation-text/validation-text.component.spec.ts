import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTextComponent } from './validation-text.component';

describe('ValidationTextComponent', () => {
  let component: ValidationTextComponent;
  let fixture: ComponentFixture<ValidationTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
