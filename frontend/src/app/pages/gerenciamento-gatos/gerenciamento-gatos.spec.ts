import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoGatos } from './gerenciamento-gatos';

describe('GerenciamentoGatos', () => {
  let component: GerenciamentoGatos;
  let fixture: ComponentFixture<GerenciamentoGatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciamentoGatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoGatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
