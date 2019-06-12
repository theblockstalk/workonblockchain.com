import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackexchangeUrlComponent } from './stackexchange-url.component';

describe('StackexchangeUrlComponent', () => {
  let component: StackexchangeUrlComponent;
  let fixture: ComponentFixture<StackexchangeUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackexchangeUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackexchangeUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
