import { TestBed } from '@angular/core/testing';
import { AguaLienzo } from './agua-lienzo';

describe('AguaLienzo', () => {
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

  it('monta el canvas del lienzo de agua', async () => {
    await TestBed.configureTestingModule({
      imports: [AguaLienzo],
    }).compileComponents();

    const fixture = TestBed.createComponent(AguaLienzo);
    fixture.detectChanges();
    await fixture.whenStable();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const fallback = fixture.nativeElement.querySelector('.agua-lienzo__fallback');
    expect(canvas || fallback).toBeTruthy();
  });
});
