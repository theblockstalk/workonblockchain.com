import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlAreaComponent } from './html-area.component';

describe('HtmlAreaComponent', () => {
  let component: HtmlAreaComponent;
  let fixture: ComponentFixture<HtmlAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
