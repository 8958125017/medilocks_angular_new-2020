import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileAccountComponent } from './user-profile-account.component';

describe('UserProfileAccountComponent', () => {
  let component: UserProfileAccountComponent;
  let fixture: ComponentFixture<UserProfileAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
