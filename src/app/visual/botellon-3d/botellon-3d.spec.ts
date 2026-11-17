import { TestBed } from '@angular/core/testing';
import { Botellon3d } from './botellon-3d';

describe('Botellon3d', () => {
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

  it('monta el lienzo interactivo del porrón', async () => {
    await TestBed.configureTestingModule({
      imports: [Botellon3d],
    }).compileComponents();

    const fixture = TestBed.createComponent(Botellon3d);
    fixture.detectChanges();
    await fixture.whenStable();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const fallback = fixture.nativeElement.querySelector('.botellon-3d__fallback');
    expect(canvas || fallback).toBeTruthy();
  });
});
