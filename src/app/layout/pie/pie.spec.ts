import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Pie } from './pie';

describe('Pie', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pie],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra la empresa y el correo de contacto', async () => {
    const fixture = TestBed.createComponent(Pie);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Embotelladora Cool Ice SAS');
    expect(compiled.querySelector('a[href^="mailto:embotelladoracoolicesas@gmail.com"]')).toBeTruthy();
    expect(compiled.querySelector('a[href*="proceso"]')).toBeTruthy();
  });
});
