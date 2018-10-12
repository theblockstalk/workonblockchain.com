import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomePopupEditorComponent } from './welcome-popup-editor.component';

describe('WelcomePopupEditorComponent', () => {
  let component: WelcomePopupEditorComponent;
  let fixture: ComponentFixture<WelcomePopupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomePopupEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePopupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
