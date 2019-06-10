import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalWebsiteUrlComponent } from './personal-website-url.component';

describe('PersonalWebsiteUrlComponent', () => {
  let component: PersonalWebsiteUrlComponent;
  let fixture: ComponentFixture<PersonalWebsiteUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalWebsiteUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalWebsiteUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
