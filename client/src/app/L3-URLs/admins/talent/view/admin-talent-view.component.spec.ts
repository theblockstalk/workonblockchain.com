import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTalentViewComponent } from './admin-talent-view.component';

describe('AdminTalentViewComponent', () => {
  let component: AdminTalentViewComponent;
  let fixture: ComponentFixture<AdminTalentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTalentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTalentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
