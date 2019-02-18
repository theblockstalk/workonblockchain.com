import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesLandingPageComponent } from './companies-landing-page.component';

describe('CompaniesLandingPageComponent', () => {
  let component: CompaniesLandingPageComponent;
  let fixture: ComponentFixture<CompaniesLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
