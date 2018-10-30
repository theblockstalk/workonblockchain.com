import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisplayChatComponent } from './admin-display-chat.component';

describe('AdminDisplayChatComponent', () => {
  let component: AdminDisplayChatComponent;
  let fixture: ComponentFixture<AdminDisplayChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisplayChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDisplayChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
