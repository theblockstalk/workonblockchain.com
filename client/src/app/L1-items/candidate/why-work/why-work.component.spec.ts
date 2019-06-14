import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyWorkComponent } from './why-work.component';

describe('WhyWorkComponent', () => {
  let component: WhyWorkComponent;
  let fixture: ComponentFixture<WhyWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
