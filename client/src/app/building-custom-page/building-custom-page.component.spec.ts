import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingCustomPageComponent } from './building-custom-page.component';

describe('BuildingCustomPageComponent', () => {
  let component: BuildingCustomPageComponent;
  let fixture: ComponentFixture<BuildingCustomPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingCustomPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingCustomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
