import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Inicio } from './inicio';

describe('Inicio', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra el layout del Figma con producto estrella y canales reales', async () => {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const texto = compiled.textContent ?? '';

    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.querySelector('h1')?.textContent).toContain('fresca y confiable');
    expect(texto).toContain('18,9 L');
    expect(texto).toContain('RSA-0024680-2023');
    expect(texto).toContain('Proceso de purificación');
    expect(texto).toContain('Solicita tu pedido');
    expect(texto).not.toContain('Pendiente');
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('#beneficios')).toBeTruthy();
    expect(compiled.querySelector('#producto')).toBeTruthy();
    expect(compiled.querySelector('#proceso')).toBeTruthy();
    expect(compiled.querySelector('#domicilio')).toBeTruthy();
    expect(compiled.querySelector('#confianza')).toBeTruthy();
    expect(compiled.querySelector('#contacto')).toBeTruthy();
    expect(compiled.querySelector('a[href^="https://wa.me/573216820822"]')).toBeTruthy();
    expect(compiled.querySelector('a[href^="mailto:embotelladoracoolicesas@gmail.com"]')).toBeTruthy();
  });
});
