import { TestBed } from '@angular/core/testing';
import { OndasCanvas } from './ondas-canvas';

describe('OndasCanvas', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
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

  it('usa fallback cuando hay movimiento reducido', async () => {
    await TestBed.configureTestingModule({
      imports: [OndasCanvas],
    }).compileComponents();

    const fixture = TestBed.createComponent(OndasCanvas);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.ondas-canvas__fallback')).toBeTruthy();
  });
});
