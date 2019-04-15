import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosuggestCitiesBadgesComponent } from './autosuggest-cities-badges.component';

describe('AutosuggestCitiesBadgesComponent', () => {
  let component: AutosuggestCitiesBadgesComponent;
  let fixture: ComponentFixture<AutosuggestCitiesBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosuggestCitiesBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosuggestCitiesBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
