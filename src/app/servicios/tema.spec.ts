import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tema } from './tema';

describe('Tema', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-tema');
  });

  it('usa sistema por defecto', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const tema = TestBed.inject(Tema);
    expect(tema.preferencia()).toBe('sistema');
    expect(document.documentElement.dataset['tema']).toBe('sistema');
  });

  it('cicla sistema → claro → oscuro → sistema', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: document }],
    });
    const tema = TestBed.inject(Tema);
    tema.ciclar();
    expect(tema.preferencia()).toBe('claro');
    expect(localStorage.getItem('cool-ice-tema')).toBe('claro');
    tema.ciclar();
    expect(tema.preferencia()).toBe('oscuro');
    tema.ciclar();
    expect(tema.preferencia()).toBe('sistema');
  });
});
