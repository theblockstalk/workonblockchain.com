import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAddressComponent } from './email-address.component';

describe('EmailAddressComponent', () => {
  let component: EmailAddressComponent;
  let fixture: ComponentFixture<EmailAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
