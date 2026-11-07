import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Encabezado } from './encabezado';
import { MenuMovil } from '../../servicios/menu-movil';

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
    const menu = TestBed.inject(MenuMovil);

    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(boton.textContent).toContain('Abrir menú');
    expect(menu.abierto()).toBe(false);

    boton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(boton.getAttribute('aria-expanded')).toBe('true');
    expect(boton.textContent).toContain('Cerrar menú');
    expect(menu.abierto()).toBe(true);
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

  it('expone el botón de cierre mientras el menú está abierto', async () => {
    const fixture = TestBed.createComponent(Encabezado);
    await fixture.whenStable();
    const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const menu = TestBed.inject(MenuMovil);

    boton.click();
    fixture.detectChanges();
    expect(menu.abierto()).toBe(true);
    expect(boton.textContent).toContain('Cerrar menú');
    expect(boton.getAttribute('aria-expanded')).toBe('true');

    boton.click();
    fixture.detectChanges();
    expect(menu.abierto()).toBe(false);
    expect(boton.getAttribute('aria-expanded')).toBe('false');
  });
});
