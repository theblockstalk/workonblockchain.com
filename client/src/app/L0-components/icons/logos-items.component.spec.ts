import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogosItemsComponent } from './logos-items.component';

describe('LogosItemsComponent', () => {
  let component: LogosItemsComponent;
  let fixture: ComponentFixture<LogosItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogosItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogosItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
