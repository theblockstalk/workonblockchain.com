import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyEditorComponent } from './privacy-editor.component';

describe('PrivacyEditorComponent', () => {
  let component: PrivacyEditorComponent;
  let fixture: ComponentFixture<PrivacyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
