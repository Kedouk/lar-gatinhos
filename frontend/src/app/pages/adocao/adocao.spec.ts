import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adocao } from './adocao';

describe('Adocao', () => {
  let component: Adocao;
  let fixture: ComponentFixture<Adocao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adocao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adocao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
