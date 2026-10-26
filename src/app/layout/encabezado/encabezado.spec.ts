import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Encabezado } from './encabezado';

describe('Encabezado', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encabezado],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('abre y cierra el menú con el botón', async () => {
    const fixture = TestBed.createComponent(Encabezado);
    await fixture.whenStable();
    const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(boton.textContent).toContain('Abrir menú');

    boton.click();
    await fixture.whenStable();

    expect(boton.getAttribute('aria-expanded')).toBe('true');
    expect(boton.textContent).toContain('Cerrar menú');
  });

  it('enlaza las secciones de la página', async () => {
    const fixture = TestBed.createComponent(Encabezado);
    await fixture.whenStable();
    const enlaces = [...fixture.nativeElement.querySelectorAll('a')].map(
      (enlace: HTMLAnchorElement) => enlace.getAttribute('href') ?? '',
    );

    expect(enlaces.some((href) => href.includes('productos'))).toBe(true);
    expect(enlaces.some((href) => href.includes('contacto'))).toBe(true);
    expect(enlaces.some((href) => href.startsWith('https://wa.me/573216820822'))).toBe(true);
  });
});
