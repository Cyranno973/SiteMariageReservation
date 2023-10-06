import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserContentInputComponent} from './user-content-input.component';

describe('UserContentInputComponent', () => {
  let component: UserContentInputComponent;
  let fixture: ComponentFixture<UserContentInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContentInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
