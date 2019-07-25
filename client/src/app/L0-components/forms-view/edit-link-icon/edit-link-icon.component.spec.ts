import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLinkIconComponent } from './edit-link-icon.component';

describe('EditLinkIconComponent', () => {
  let component: EditLinkIconComponent;
  let fixture: ComponentFixture<EditLinkIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLinkIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLinkIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
