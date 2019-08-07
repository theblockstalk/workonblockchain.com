import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearAboutWobOtherInfoComponent } from './hear-about-wob-other-info.component';

describe('HearAboutWobOtherInfoComponent', () => {
  let component: HearAboutWobOtherInfoComponent;
  let fixture: ComponentFixture<HearAboutWobOtherInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearAboutWobOtherInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearAboutWobOtherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
