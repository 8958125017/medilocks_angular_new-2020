import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycalanderComponent } from './mycalander.component';

describe('MycalanderComponent', () => {
  let component: MycalanderComponent;
  let fixture: ComponentFixture<MycalanderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycalanderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycalanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
