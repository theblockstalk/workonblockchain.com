import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownAutosuggestComponent } from './dropdown-autosuggest.component';

describe('DropdownAutosuggestComponent', () => {
  let component: DropdownAutosuggestComponent;
  let fixture: ComponentFixture<DropdownAutosuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownAutosuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownAutosuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
