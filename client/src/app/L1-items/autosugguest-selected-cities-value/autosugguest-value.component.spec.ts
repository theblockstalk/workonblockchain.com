import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutosugguestValueComponent } from './autosugguest-value.component';

describe('AutosugguestValueComponent', () => {
  let component: AutosugguestValueComponent;
  let fixture: ComponentFixture<AutosugguestValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutosugguestValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutosugguestValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
