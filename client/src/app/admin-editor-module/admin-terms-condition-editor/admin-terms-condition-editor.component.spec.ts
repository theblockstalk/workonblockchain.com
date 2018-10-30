import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTermsConditionEditorComponent } from './admin-terms-condition-editor.component';

describe('AdminTermsConditionEditorComponent', () => {
  let component: AdminTermsConditionEditorComponent;
  let fixture: ComponentFixture<AdminTermsConditionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTermsConditionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTermsConditionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
