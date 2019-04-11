import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSuggestCitiesComponent } from './auto-suggest-cities.component';

describe('AutoSuggestCitiesComponent', () => {
  let component: AutoSuggestCitiesComponent;
  let fixture: ComponentFixture<AutoSuggestCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSuggestCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSuggestCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
