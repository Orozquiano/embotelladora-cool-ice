import { DOCUMENT } from '@angular/core';
import { Injectable, inject } from '@angular/core';

/**
 * @interface TinteAmbiente
 * @description Color de ambiente asociado a una sección anclable.
 */
interface TinteAmbiente {
  /**
   * @description Identificador del elemento de sección.
   */
  id: string;

  /**
   * @description Variable CSS del tinte (definida en tokens claro/oscuro).
   */
  variable: string;
}

/**
 * @class AmbienteFondo
 * @description Difumina el color de fondo global según la sección visible al hacer scroll.
 */
@Injectable({ providedIn: 'root' })
export class AmbienteFondo {
  private readonly documento = inject(DOCUMENT);

  /**
   * @description Secciones que aportan tinte al ambiente, en orden de página.
   */
  private readonly tintes: readonly TinteAmbiente[] = [
    { id: 'inicio', variable: '--ambiente-inicio' },
    { id: 'beneficios', variable: '--ambiente-beneficios' },
    { id: 'producto', variable: '--ambiente-producto' },
    { id: 'proceso', variable: '--ambiente-proceso' },
    { id: 'domicilio', variable: '--ambiente-domicilio' },
    { id: 'confianza', variable: '--ambiente-confianza' },
    { id: 'contacto', variable: '--ambiente-contacto' },
  ];

  /**
   * @description Observador que detecta qué sección ocupa el centro de la ventana.
   */
  private observador: IntersectionObserver | null = null;

  /**
   * @description Identificador de la sección ambiente activa.
   */
  private activa = 'inicio';

  /**
   * @function iniciar
   * @description Observa las secciones y actualiza el tinte de fondo.
   */
  iniciar(): void {
    this.detener();
    const raiz = this.documento.documentElement;
    const nodos = this.tintes
      .map((tinte) => this.documento.getElementById(tinte.id))
      .filter((nodo): nodo is HTMLElement => nodo !== null);

    if (nodos.length === 0) {
      return;
    }

    this.aplicar(this.activa);

    if (typeof IntersectionObserver !== 'function') {
      return;
    }

    this.observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const elegida = visibles[0]?.target;
        if (!(elegida instanceof HTMLElement) || !elegida.id || elegida.id === this.activa) {
          return;
        }

        this.activa = elegida.id;
        this.aplicar(this.activa);
        raiz.dataset['ambiente'] = this.activa;
      },
      {
        // Ventana centrada: el tinte cambia al llegar a la sección.
        root: null,
        rootMargin: '-28% 0px -42% 0px',
        threshold: [0.15, 0.35, 0.55, 0.75],
      },
    );

    for (const nodo of nodos) {
      this.observador.observe(nodo);
    }
  }

  /**
   * @function detener
   * @description Libera el observador de secciones.
   */
  detener(): void {
    this.observador?.disconnect();
    this.observador = null;
  }

  /**
   * @function aplicar
   * @description Asigna el tinte de la sección al fondo ambiente.
   * @param id Identificador de la sección.
   */
  private aplicar(id: string): void {
    const tinte = this.tintes.find((item) => item.id === id) ?? this.tintes[0];
    if (!tinte) {
      return;
    }

    const raiz = this.documento.documentElement;
    raiz.style.setProperty('--color-ambiente', `var(${tinte.variable})`);
    raiz.dataset['ambiente'] = tinte.id;
  }
}
