import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowHearAboutWobComponent } from './how-hear-about-wob.component';

describe('HowHearAboutWobComponent', () => {
  let component: HowHearAboutWobComponent;
  let fixture: ComponentFixture<HowHearAboutWobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowHearAboutWobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowHearAboutWobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
