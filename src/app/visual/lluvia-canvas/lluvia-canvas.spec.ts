import { TestBed } from '@angular/core/testing';
import { LluviaCanvas } from './lluvia-canvas';

describe('LluviaCanvas', () => {
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
      imports: [LluviaCanvas],
    }).compileComponents();

    const fixture = TestBed.createComponent(LluviaCanvas);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.lluvia-canvas__fallback')).toBeTruthy();
  });
});
