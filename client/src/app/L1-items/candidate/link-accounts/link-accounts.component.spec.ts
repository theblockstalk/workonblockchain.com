import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAccountsComponent } from './link-accounts.component';

describe('LinkAccountsComponent', () => {
  let component: LinkAccountsComponent;
  let fixture: ComponentFixture<LinkAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
