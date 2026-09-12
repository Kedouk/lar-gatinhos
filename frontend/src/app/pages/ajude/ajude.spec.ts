import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ajude } from './ajude';

describe('Ajude', () => {
  let component: Ajude;
  let fixture: ComponentFixture<Ajude>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ajude]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ajude);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
