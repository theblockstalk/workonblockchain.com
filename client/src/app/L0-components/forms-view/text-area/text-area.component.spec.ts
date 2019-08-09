import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAreaViewComponent } from './text-area.component';

describe('TextAreaViewComponent', () => {
  let component: TextAreaViewComponent;
  let fixture: ComponentFixture<TextAreaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAreaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
