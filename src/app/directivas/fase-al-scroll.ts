import {
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
} from '@angular/core';

/**
 * @description Marca fases al entrar al viewport y notifica el índice activo.
 */
@Directive({
  selector: '[appFaseAlScroll]',
  host: {
    class: 'fase-scroll',
  },
})
export class FaseAlScroll {
  /**
   * @description Índice de la fase (0-based).
   */
  readonly indice = input(0, { alias: 'appFaseAlScroll' });

  /**
   * @description Emite el índice cuando la fase entra / queda activa.
   */
  readonly faseActiva = output<number>();

  private readonly host = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      const nodo = this.host.nativeElement;
      const reducir =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducir) {
        nodo.classList.add('is-revelado', 'is-activo');
        this.faseActiva.emit(this.indice());
        return;
      }

      if (typeof IntersectionObserver === 'undefined') {
        nodo.classList.add('is-revelado', 'is-activo');
        this.faseActiva.emit(this.indice());
        return;
      }

      const observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (entrada.isIntersecting) {
              nodo.classList.add('is-revelado');
              if (entrada.intersectionRatio >= 0.45) {
                nodo.classList.add('is-activo');
                this.faseActiva.emit(this.indice());
              }
            } else {
              nodo.classList.remove('is-activo');
            }
          }
        },
        { threshold: [0.2, 0.45, 0.7], rootMargin: '-10% 0px -25% 0px' },
      );
      observador.observe(nodo);
    });
  }
}
