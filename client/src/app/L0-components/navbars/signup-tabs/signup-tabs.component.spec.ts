import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupTabsComponent } from './signup-tabs.component';

describe('SignupTabsComponent', () => {
  let component: SignupTabsComponent;
  let fixture: ComponentFixture<SignupTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
