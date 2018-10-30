import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFaqEditorComponent } from './admin-faq-editor.component';

describe('AdminFaqEditorComponent', () => {
  let component: AdminFaqEditorComponent;
  let fixture: ComponentFixture<AdminFaqEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFaqEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFaqEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
