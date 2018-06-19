import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsWizardComponent } from './terms-wizard.component';

describe('TermsWizardComponent', () => {
  let component: TermsWizardComponent;
  let fixture: ComponentFixture<TermsWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
