import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosuggestSelectedValueComponent } from './badge.component';

describe('AutosuggestSelectedValueComponent', () => {
  let component: AutosuggestSelectedValueComponent;
  let fixture: ComponentFixture<AutosuggestSelectedValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosuggestSelectedValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosuggestSelectedValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
