import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddJobComponent } from './company-add-job.component';

describe('CompanyAddJobComponent', () => {
  let component: CompanyAddJobComponent;
  let fixture: ComponentFixture<CompanyAddJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
