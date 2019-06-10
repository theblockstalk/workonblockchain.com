import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialSkillsComponent } from './commercial-skills.component';

describe('CommercialSkillsComponent', () => {
  let component: CommercialSkillsComponent;
  let fixture: ComponentFixture<CommercialSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommercialSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
