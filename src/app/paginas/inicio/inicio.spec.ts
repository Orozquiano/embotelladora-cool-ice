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
    expect(texto).toContain('5.000 ml');
    expect(texto).toContain('Dispensador');
    expect(texto).toContain('RSA-0024680-2023');
    expect(compiled.querySelector('form')).toBeNull();
    expect(compiled.querySelector('a[href^="https://wa.me/573216820822"]')).toBeTruthy();
    expect(compiled.querySelector('a[href^="mailto:embotelladoracoolicesas@gmail.com"]')).toBeTruthy();
    expect(compiled.querySelector('a[href="tel:+573136351406"]')).toBeTruthy();
    expect(texto).toContain('Pendiente');
  });
});
