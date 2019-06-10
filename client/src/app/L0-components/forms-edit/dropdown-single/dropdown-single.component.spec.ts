import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSingleComponent } from './dropdown-single.component';

describe('DropdownSingleComponent', () => {
  let component: DropdownSingleComponent;
  let fixture: ComponentFixture<DropdownSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
