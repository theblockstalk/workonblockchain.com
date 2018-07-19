import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileLinkComponent } from './public-profile-link.component';

describe('PublicProfileLinkComponent', () => {
  let component: PublicProfileLinkComponent;
  let fixture: ComponentFixture<PublicProfileLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicProfileLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
