import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BySubscriptionComponent } from './by-subscription.component';

describe('BySubscriptionComponent', () => {
  let component: BySubscriptionComponent;
  let fixture: ComponentFixture<BySubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BySubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BySubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
