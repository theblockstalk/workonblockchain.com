import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinImportComponent } from './linkedin-import.component';

describe('LinkedinImportComponent', () => {
  let component: LinkedinImportComponent;
  let fixture: ComponentFixture<LinkedinImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
