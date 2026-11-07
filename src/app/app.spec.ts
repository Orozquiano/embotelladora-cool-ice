import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('crea el cascarón con el contenido principal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-encabezado')).toBeTruthy();
    expect(compiled.querySelector('main#contenido')).toBeTruthy();
    expect(compiled.querySelector('app-pie')).toBeTruthy();
    expect(compiled.querySelector('.saltar')?.textContent).toContain('Saltar al contenido');
    expect(compiled.querySelector('a.cta-flotante[href^="https://wa.me/573216820822"]')).toBeTruthy();
  });
});
