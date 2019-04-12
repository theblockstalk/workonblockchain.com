import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosuggestBadgesComponent } from './autosuggest-badges.component';

describe('AutosuggestBadgesComponent', () => {
  let component: AutosuggestBadgesComponent;
  let fixture: ComponentFixture<AutosuggestBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosuggestBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosuggestBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
