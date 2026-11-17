import { TestBed } from '@angular/core/testing';
import { LluviaFondo } from './lluvia-fondo';

describe('LluviaFondo', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
        onchange: null,
      }),
    });
  });

  it('monta el lienzo de lluvia', async () => {
    await TestBed.configureTestingModule({
      imports: [LluviaFondo],
    }).compileComponents();

    const fixture = TestBed.createComponent(LluviaFondo);
    fixture.detectChanges();
    await fixture.whenStable();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const fallback = fixture.nativeElement.querySelector('.lluvia-fondo__fallback');
    expect(canvas || fallback).toBeTruthy();
  });
});
