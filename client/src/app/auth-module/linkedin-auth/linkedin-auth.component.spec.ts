import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinAuthComponent } from './linkedin-auth.component';

describe('LinkedinAuthComponent', () => {
  let component: LinkedinAuthComponent;
  let fixture: ComponentFixture<LinkedinAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
