import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelOnboardingComponent } from './channel-onboarding.component';

describe('ChannelOnboardingComponent', () => {
  let component: ChannelOnboardingComponent;
  let fixture: ComponentFixture<ChannelOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
