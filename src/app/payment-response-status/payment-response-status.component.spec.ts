import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentResponseStatusComponent } from './payment-response-status.component';

describe('PaymentResponseStatusComponent', () => {
  let component: PaymentResponseStatusComponent;
  let fixture: ComponentFixture<PaymentResponseStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentResponseStatusComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentResponseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

