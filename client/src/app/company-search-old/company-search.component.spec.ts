import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySearchComponent } from './company-search.component';

describe('CompanySearchComponent', () => {
  let component: CompanySearchComponent;
  let fixture: ComponentFixture<CompanySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
