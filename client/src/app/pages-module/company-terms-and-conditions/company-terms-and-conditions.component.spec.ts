import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTermsAndConditionsComponent } from './company-terms-and-conditions.component';

describe('CompanyTermsAndConditionsComponent', () => {
  let component: CompanyTermsAndConditionsComponent;
  let fixture: ComponentFixture<CompanyTermsAndConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTermsAndConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
