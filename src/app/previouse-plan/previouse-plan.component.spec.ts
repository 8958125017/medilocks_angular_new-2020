import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousePlanComponent } from './previouse-plan.component';

describe('PreviousePlanComponent', () => {
  let component: PreviousePlanComponent;
  let fixture: ComponentFixture<PreviousePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
