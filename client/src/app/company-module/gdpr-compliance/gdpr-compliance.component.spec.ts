import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GDPRComplianceComponent } from './gdpr-compliance.component';

describe('GDPRComplianceComponent', () => {
  let component: GDPRComplianceComponent;
  let fixture: ComponentFixture<GDPRComplianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GDPRComplianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GDPRComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
