import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumUrlComponent } from './medium-url.component';

describe('MediumUrlComponent', () => {
  let component: MediumUrlComponent;
  let fixture: ComponentFixture<MediumUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediumUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
