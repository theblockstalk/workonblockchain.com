import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosuggestCitiesSelectedValueComponent } from './autosuggest-cities-selected-value.component';

describe('AutosuggestCitiesSelectedValueComponent', () => {
  let component: AutosuggestCitiesSelectedValueComponent;
  let fixture: ComponentFixture<AutosuggestCitiesSelectedValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosuggestCitiesSelectedValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosuggestCitiesSelectedValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
