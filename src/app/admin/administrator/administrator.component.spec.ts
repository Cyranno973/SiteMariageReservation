import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorComponent } from './administrator.component';

describe('AdminComponent', () => {
  let component: AdministratorComponent;
  let fixture: ComponentFixture<AdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
