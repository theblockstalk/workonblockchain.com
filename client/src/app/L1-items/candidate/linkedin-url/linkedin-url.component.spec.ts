import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinUrlComponent } from './linkedin-url.component';

describe('LinkedinUrlComponent', () => {
  let component: LinkedinUrlComponent;
  let fixture: ComponentFixture<LinkedinUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
