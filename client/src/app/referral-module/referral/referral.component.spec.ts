import { TestBed, async } from '@angular/core/testing';
import { ReferralComponent } from './referral.component';
describe('ReferralComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReferralComponent
      ],
    }).compileComponents();
  }));
  it('should create the referral', async(() => {
    const fixture = TestBed.createComponent(ReferralComponent);
    const referral = fixture.debugElement.componentInstance;
    expect(referral).toBeTruthy();
  }));
  it(`should have as title 'referral'`, async(() => {
    const fixture = TestBed.createComponent(ReferralComponent);
    const referral = fixture.debugElement.componentInstance;
    expect(referral.title).toEqual('referral');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(ReferralComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to client!');
  }));
});
