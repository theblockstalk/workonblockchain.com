import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextLinkedIconComponent } from './text-linked-icon.component';

describe('TextLinkedIconComponent', () => {
  let component: TextLinkedIconComponent;
  let fixture: ComponentFixture<TextLinkedIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextLinkedIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextLinkedIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
