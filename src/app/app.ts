import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { lineaPedidos } from './contenido/sitio';
import { Encabezado } from './layout/encabezado/encabezado';
import { Pie } from './layout/pie/pie';
import { MenuMovil } from './servicios/menu-movil';

/**
 * @class App
 * @description Cascarón del sitio: salto al contenido, navegación, página y pie.
 */
@Component({
  imports: [RouterOutlet, Encabezado, Pie],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * @description Desplazamiento de la ventana, ajustado para no ocultar las secciones bajo el encabezado.
   */
  private readonly desplazamiento = inject(ViewportScroller);

  /**
   * @description Estado del menú estrecho.
   */
  private readonly menuMovil = inject(MenuMovil);

  /**
   * @description Limpia observadores al destruir el cascarón.
   */
  private readonly destruir = inject(DestroyRef);

  /**
   * @description Enrutador para reenganchar el CTA flotante tras cargar la home.
   */
  private readonly enrutador = inject(Router);

  /**
   * @description WhatsApp de pedidos para el acceso flotante en celular.
   */
  protected readonly whatsapp = lineaPedidos.whatsapp;

  /**
   * @description Indica si el menú estrecho está abierto.
   */
  protected readonly menuAbierto = this.menuMovil.abierto;

  /**
   * @description El CTA del hero dejó de verse en la ventana.
   */
  private readonly heroCtaFuera = signal(false);

  /**
   * @description Los controles de contacto están a la vista.
   */
  private readonly contactoVisible = signal(false);

  /**
   * @description Observador del CTA del hero.
   */
  private observadorHero: IntersectionObserver | null = null;

  /**
   * @description Observador de la sección de contacto.
   */
  private observadorContacto: IntersectionObserver | null = null;

  /**
   * @description Muestra el acceso flotante solo cuando no hay otro CTA útil a la vista.
   */
  protected readonly ctaFlotanteVisible = computed(
    () => !this.menuAbierto() && this.heroCtaFuera() && !this.contactoVisible(),
  );

  constructor() {
    this.desplazamiento.setOffset([0, 68]);

    afterNextRender(() => {
      this.programarObservacionCta();
    });

    this.enrutador.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.programarObservacionCta());

    this.destruir.onDestroy(() => {
      this.observadorHero?.disconnect();
      this.observadorContacto?.disconnect();
    });
  }

  /**
   * @function programarObservacionCta
   * @description Espera a que el DOM de la home exista antes de observar CTAs.
   */
  private programarObservacionCta(): void {
    queueMicrotask(() => this.observarCtaFlotante());
  }

  /**
   * @function observarCtaFlotante
   * @description Decide cuándo el botón flotante aporta un acceso real en pantallas estrechas.
   */
  private observarCtaFlotante(intento = 0): void {
    if (typeof IntersectionObserver !== 'function') {
      this.heroCtaFuera.set(true);
      return;
    }

    const heroCta = document.querySelector<HTMLElement>('#inicio .acciones .boton--whatsapp');
    const contacto = document.querySelector<HTMLElement>('#contacto');

    if (!heroCta || !contacto) {
      if (intento < 20) {
        requestAnimationFrame(() => this.observarCtaFlotante(intento + 1));
      }
      return;
    }

    this.observadorHero?.disconnect();
    this.observadorContacto?.disconnect();

    this.observadorHero = new IntersectionObserver(
      ([entrada]) => this.heroCtaFuera.set(!entrada.isIntersecting),
      { threshold: [0, 0.1, 0.25], rootMargin: '0px' },
    );
    this.observadorHero.observe(heroCta);

    this.observadorContacto = new IntersectionObserver(
      ([entrada]) => this.contactoVisible.set(entrada.isIntersecting),
      { threshold: 0.1 },
    );
    this.observadorContacto.observe(contacto);
  }
}
