import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotRequireSkillsComponent } from './not-require-skills.component';

describe('NotRequireSkillsComponent', () => {
  let component: NotRequireSkillsComponent;
  let fixture: ComponentFixture<NotRequireSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotRequireSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotRequireSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
