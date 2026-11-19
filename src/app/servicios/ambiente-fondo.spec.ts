import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AmbienteFondo } from './ambiente-fondo';

describe('AmbienteFondo', () => {
  it('aplica el tinte de inicio al arrancar', () => {
    const documento = document.implementation.createHTMLDocument('ambiente');
    const inicio = documento.createElement('section');
    inicio.id = 'inicio';
    documento.body.append(inicio);

    TestBed.configureTestingModule({
      providers: [AmbienteFondo, { provide: DOCUMENT, useValue: documento }],
    });

    const servicio = TestBed.inject(AmbienteFondo);
    servicio.iniciar();

    expect(documento.documentElement.style.getPropertyValue('--color-ambiente')).toBe(
      'var(--ambiente-inicio)',
    );
    expect(documento.documentElement.dataset['ambiente']).toBe('inicio');

    servicio.detener();
  });
});
