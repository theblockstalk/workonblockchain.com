import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsAutoSuggestComponent } from './skills-auto-suggest.component';

describe('SkillsAutoSuggestComponent', () => {
  let component: SkillsAutoSuggestComponent;
  let fixture: ComponentFixture<SkillsAutoSuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsAutoSuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsAutoSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
