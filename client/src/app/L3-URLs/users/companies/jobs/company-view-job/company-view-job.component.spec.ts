import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyViewJobComponent } from './company-view-job.component';

describe('CompanyViewJobComponent', () => {
  let component: CompanyViewJobComponent;
  let fixture: ComponentFixture<CompanyViewJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyViewJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyViewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
