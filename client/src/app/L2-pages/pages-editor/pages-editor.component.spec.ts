import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesEditorComponent } from './pages-editor.component';

describe('PagesEditorComponent', () => {
  let component: PagesEditorComponent;
  let fixture: ComponentFixture<PagesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
