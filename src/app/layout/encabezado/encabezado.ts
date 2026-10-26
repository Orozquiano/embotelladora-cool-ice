import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { lineaPedidos, logo, secciones } from '../../contenido/sitio';

/**
 * @class Encabezado
 * @description Barra de navegación con acceso a las secciones y menú en pantallas estrechas.
 */
@Component({
  selector: 'app-encabezado',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './encabezado.html',
  host: {
    '(document:keydown.escape)': 'cerrarConEscape()',
  },
})
export class Encabezado {
  /**
   * @description Secciones enlazadas desde la barra.
   */
  protected readonly secciones = secciones;

  /**
   * @description Logotipo de la marca.
   */
  protected readonly logo = logo;

  /**
   * @description Enlace de WhatsApp del canal principal de pedidos.
   */
  protected readonly whatsapp = lineaPedidos.whatsapp;

  /**
   * @description Indica si el menú estrecho está abierto.
   */
  protected readonly menuAbierto = signal(false);

  /**
   * @description Sección visible que se marca en la navegación.
   */
  protected readonly seccionActiva = signal('inicio');

  /**
   * @description Botón que abre el menú, para devolverle el foco al cerrarlo.
   */
  private readonly botonMenu = viewChild<ElementRef<HTMLButtonElement>>('botonMenu');

  /**
   * @description Documento donde se bloquea el desplazamiento mientras el menú está abierto.
   */
  private readonly documento = inject(DOCUMENT);

  /**
   * @description Enrutador usado para leer el fragmento activo.
   */
  private readonly enrutador = inject(Router);

  /**
   * @description Permite retirar el listener del ancho de pantalla al destruir la barra.
   */
  private readonly destruir = inject(DestroyRef);

  /**
   * @description Observador de las secciones visibles. Puede no existir en pruebas.
   */
  private observador: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      this.documento.body.style.overflow = this.menuAbierto() ? 'hidden' : '';
    });

    this.enrutador.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.actualizarDesdeFragmento();
        this.programarObservador();
      });

    afterNextRender(() => {
      this.actualizarDesdeFragmento();
      this.programarObservador();
      this.escucharAncho();
    });

    this.destruir.onDestroy(() => {
      this.observador?.disconnect();
      this.documento.body.style.overflow = '';
    });
  }

  /**
   * @function alternarMenu
   * @description Abre o cierra el menú de pantallas estrechas.
   */
  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  /**
   * @function cerrarMenu
   * @description Cierra el menú después de elegir una sección.
   */
  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  /**
   * @function cerrarConEscape
   * @description Cierra el menú con la tecla Escape y regresa el foco al botón.
   */
  protected cerrarConEscape(): void {
    if (!this.menuAbierto()) {
      return;
    }

    this.cerrarMenu();
    this.botonMenu()?.nativeElement.focus();
  }

  /**
   * @function actualizarDesdeFragmento
   * @description Marca la sección que viene en la URL, cuando corresponde a una sección real.
   */
  private actualizarDesdeFragmento(): void {
    const fragmento = this.enrutador.parseUrl(this.enrutador.url).fragment;
    if (fragmento && this.secciones.some((seccion) => seccion.id === fragmento)) {
      this.seccionActiva.set(fragmento);
    }
  }

  /**
   * @function programarObservador
   * @description Espera a que las secciones existan antes de observarlas.
   */
  private programarObservador(): void {
    queueMicrotask(() => this.observarSecciones());
  }

  /**
   * @function observarSecciones
   * @description Actualiza el enlace activo según la sección que ocupa el centro de la ventana.
   */
  private observarSecciones(): void {
    this.observador?.disconnect();
    if (typeof IntersectionObserver !== 'function') {
      return;
    }

    const seccionesVisibles = this.documento.querySelectorAll<HTMLElement>('main section[id]');
    if (seccionesVisibles.length === 0) {
      return;
    }

    try {
      this.observador = new IntersectionObserver(
        (entradas) => {
          const visible = entradas
            .filter((entrada) => entrada.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          const id = visible?.target.id;
          if (id) {
            this.seccionActiva.set(id);
          }
        },
        { rootMargin: '-40% 0px -45% 0px', threshold: [0.1, 0.4, 0.7] },
      );
    } catch {
      return;
    }

    seccionesVisibles.forEach((seccion) => this.observador?.observe(seccion));
  }

  /**
   * @function escucharAncho
   * @description Cierra el menú cuando la barra horizontal vuelve a caber.
   */
  private escucharAncho(): void {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const consulta = window.matchMedia('(min-width: 60rem)');
    const alCambiar = () => {
      if (consulta.matches) {
        this.cerrarMenu();
      }
    };

    consulta.addEventListener('change', alCambiar);
    this.destruir.onDestroy(() => consulta.removeEventListener('change', alCambiar));
  }
}
