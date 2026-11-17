import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * @description Añade la clase `.is-revelado` cuando el elemento entra al viewport.
 */
@Directive({
  selector: '[appRevelarAlScroll]',
  host: {
    class: 'revelar',
  },
})
export class RevelarAlScroll {
  /**
   * @description Umbral de intersección (0–1).
   */
  readonly umbral = input(0.18);

  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      const nodo = this.host.nativeElement;
      const reducirMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducirMotion) {
        nodo.classList.add('is-revelado');
        return;
      }

      if (typeof IntersectionObserver === 'undefined') {
        nodo.classList.add('is-revelado');
        return;
      }

      const observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) {
              nodo.classList.add('is-revelado');
              observador.unobserve(nodo);
            }
          }
        },
        { threshold: this.umbral(), rootMargin: '0px 0px -8% 0px' },
      );
      observador.observe(nodo);
    });
  }
}
