import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTimeframeSearchComponent } from './admin-timeframe-search.component';

describe('AdminTimeframeSearchComponent', () => {
  let component: AdminTimeframeSearchComponent;
  let fixture: ComponentFixture<AdminTimeframeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTimeframeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTimeframeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
