import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoiffeurComponent } from './coiffeur.component';

describe('CoiffeurComponent', () => {
  let component: CoiffeurComponent;
  let fixture: ComponentFixture<CoiffeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoiffeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoiffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
