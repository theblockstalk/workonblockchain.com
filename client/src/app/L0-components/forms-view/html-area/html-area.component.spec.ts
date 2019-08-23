import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlAreaViewComponent } from './html-area.component';

describe('HtmlAreaViewComponent', () => {
  let component: HtmlAreaViewComponent;
  let fixture: ComponentFixture<HtmlAreaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlAreaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlAreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
