import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTalentEditComponent } from './admin-talent-edit.component';

describe('AdminTalentEditComponent', () => {
  let component: AdminTalentEditComponent;
  let fixture: ComponentFixture<AdminTalentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTalentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTalentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
