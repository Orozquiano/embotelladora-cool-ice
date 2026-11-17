import { TestBed } from '@angular/core/testing';
import { CascadaAgua } from './cascada-agua';

describe('CascadaAgua', () => {
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

  it('monta el lienzo de cascada', async () => {
    await TestBed.configureTestingModule({
      imports: [CascadaAgua],
    }).compileComponents();

    const fixture = TestBed.createComponent(CascadaAgua);
    fixture.detectChanges();
    await fixture.whenStable();

    const canvas = fixture.nativeElement.querySelector('canvas');
    const fallback = fixture.nativeElement.querySelector('.cascada-agua__fallback');
    expect(canvas || fallback).toBeTruthy();
  });
});
