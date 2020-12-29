import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MypatientsComponent } from './mypatients.component';

describe('MypatientsComponent', () => {
  let component: MypatientsComponent;
  let fixture: ComponentFixture<MypatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MypatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
