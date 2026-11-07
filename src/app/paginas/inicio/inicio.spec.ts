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

  it('muestra un solo título principal, los productos y los canales reales', async () => {
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const texto = compiled.textContent ?? '';

    expect(compiled.querySelectorAll('h1')).toHaveLength(1);
    expect(compiled.querySelector('h1')?.textContent).toContain('Agua tratada, fresca y confiable');
    expect(texto).toContain('18,9 L');
    expect(texto).not.toContain('3 gal');
    expect(texto).toContain('5.000 ml');
    expect(texto).toContain('Dispensador');
    expect(texto).toContain('RSA-0024680-2023');
    expect(texto).not.toContain('Pendiente');
    expect(texto).not.toContain('Figma');
    expect(compiled.querySelector('form')).toBeNull();
    const whatsapps = [...compiled.querySelectorAll('a[href^="https://wa.me/573216820822"]')].map(
      (enlace) => (enlace as HTMLAnchorElement).href,
    );
    expect(whatsapps.length).toBeGreaterThanOrEqual(3);
    expect(whatsapps.some((href) => href.includes('18%2C9'))).toBe(true);
    expect(whatsapps.some((href) => href.includes('5.000') || href.includes('5%2C000') || href.includes('botella'))).toBe(
      true,
    );
    expect(whatsapps.some((href) => href.includes('dispensador'))).toBe(true);
    expect(compiled.querySelector('a[href^="mailto:embotelladoracoolicesas@gmail.com"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="tel:+573136351406"]')).toBeTruthy();
  });
});

