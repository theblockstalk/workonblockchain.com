import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPopupEditorComponent } from './chat-popup-editor.component';

describe('ChatPopupEditorComponent', () => {
  let component: ChatPopupEditorComponent;
  let fixture: ComponentFixture<ChatPopupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPopupEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPopupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
