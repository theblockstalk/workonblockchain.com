import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproachOfferRateComponent } from './approach-offer-rate.component';

describe('ApproachOfferRateComponent', () => {
  let component: ApproachOfferRateComponent;
  let fixture: ComponentFixture<ApproachOfferRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproachOfferRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproachOfferRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
