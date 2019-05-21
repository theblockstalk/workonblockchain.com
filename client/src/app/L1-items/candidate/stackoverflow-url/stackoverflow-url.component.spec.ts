import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackoverflowUrlComponent } from './stackoverflow-url.component';

describe('StackoverflowUrlComponent', () => {
  let component: StackoverflowUrlComponent;
  let fixture: ComponentFixture<StackoverflowUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackoverflowUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackoverflowUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
