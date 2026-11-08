import { NgOptimizedImage } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
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
import { MenuMovil } from '../../servicios/menu-movil';

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
    '(document:keydown)': 'contenerTeclado($event)',
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
   * @description Estado compartido del menú estrecho.
   */
  private readonly menuMovil = inject(MenuMovil);

  /**
   * @description Indica si el menú estrecho está abierto.
   */
  protected readonly menuAbierto = this.menuMovil.abierto;

  /**
   * @description Sección visible que se marca en la navegación.
   */
  protected readonly seccionActiva = signal('inicio');

  /**
   * @description Etiqueta legible de la sección activa, para el título del menú móvil.
   */
  protected readonly etiquetaActiva = computed(() => {
    const id = this.seccionActiva();
    if (id === 'inicio') {
      return 'Inicio';
    }
    return this.secciones.find((seccion) => seccion.id === id)?.etiqueta ?? 'Secciones';
  });

  /**
   * @description Botón que abre el menú, para devolverle el foco al cerrarlo.
   */
  private readonly botonMenu = viewChild<ElementRef<HTMLButtonElement>>('botonMenu');

  /**
   * @description Contenedor del encabezado, límite del foco cuando el menú está abierto.
   */
  private readonly anfitrion = inject(ElementRef<HTMLElement>);

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

  /**
   * @description Evita que el observador pise el enlace activo durante el desplazamiento suave.
   */
  private sincronizacionPausada = false;

  /**
   * @description Temporizador que reanuda la sincronización al terminar el scroll programado.
   */
  private temporizadorSincronizacion: ReturnType<typeof setTimeout> | null = null;

  /**
   * @description Posición de scroll guardada al bloquear el fondo con el menú abierto.
   */
  private desplazamientoBloqueado = 0;

  /**
   * @description Indica si el fondo ya quedó bloqueado con position fixed.
   */
  private fondoBloqueado = false;

  constructor() {
    effect(() => {
      this.bloquearDesplazamientoFondo(this.menuAbierto());
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
      if (this.temporizadorSincronizacion) {
        clearTimeout(this.temporizadorSincronizacion);
      }
      this.bloquearDesplazamientoFondo(false);
    });
  }

  /**
   * @function alternarMenu
   * @description Abre o cierra el menú de pantallas estrechas y mueve el foco al abrirlo.
   */
  protected alternarMenu(): void {
    const quedaraAbierto = !this.menuAbierto();
    this.menuMovil.alternar();
    if (quedaraAbierto) {
      requestAnimationFrame(() => this.enfocarPrimerEnlace());
    }
  }

  /**
   * @function cerrarMenu
   * @description Cierra el menú después de elegir una sección.
   */
  protected cerrarMenu(): void {
    this.menuMovil.cerrar();
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
   * @function contenerTeclado
   * @description Mantiene Tab y Shift+Tab dentro del encabezado mientras el menú está abierto.
   * @param evento Evento de teclado del documento.
   */
  protected contenerTeclado(evento: KeyboardEvent): void {
    if (!this.menuAbierto() || evento.key !== 'Tab') {
      return;
    }

    const focoables = this.obtenerFocoables();
    if (focoables.length === 0) {
      return;
    }

    const primero = focoables[0];
    const ultimo = focoables[focoables.length - 1];
    const activo = this.documento.activeElement as HTMLElement | null;
    const dentro = !!activo && focoables.includes(activo);

    if (!dentro) {
      evento.preventDefault();
      (evento.shiftKey ? ultimo : primero).focus();
      return;
    }

    if (evento.shiftKey && activo === primero) {
      evento.preventDefault();
      ultimo.focus();
      return;
    }

    if (!evento.shiftKey && activo === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  /**
   * @function actualizarDesdeFragmento
   * @description Marca la sección que viene en la URL, cuando corresponde a una sección real.
   */
  private actualizarDesdeFragmento(): void {
    const fragmento = this.enrutador.parseUrl(this.enrutador.url).fragment;
    if (fragmento && this.secciones.some((seccion) => seccion.id === fragmento)) {
      this.seccionActiva.set(fragmento);
      this.pausarSincronizacionDuranteDesplazamiento();
    }
  }

  /**
   * @function pausarSincronizacionDuranteDesplazamiento
   * @description Congela el enlace activo mientras dura el scroll suave hacia un fragmento.
   */
  private pausarSincronizacionDuranteDesplazamiento(): void {
    this.sincronizacionPausada = true;
    if (this.temporizadorSincronizacion) {
      clearTimeout(this.temporizadorSincronizacion);
    }
    this.temporizadorSincronizacion = setTimeout(() => {
      this.sincronizacionPausada = false;
      this.temporizadorSincronizacion = null;
    }, 900);
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
   * @description Actualiza el enlace activo según la sección más cercana al encabezado.
   * @param intento Número de reintento mientras el DOM de la home aún no está listo.
   */
  private observarSecciones(intento = 0): void {
    this.observador?.disconnect();
    if (typeof IntersectionObserver !== 'function') {
      return;
    }

    const seccionesVisibles = [
      ...this.documento.querySelectorAll<HTMLElement>('main section[id]'),
    ];
    if (seccionesVisibles.length === 0) {
      if (intento < 20) {
        requestAnimationFrame(() => this.observarSecciones(intento + 1));
      }
      return;
    }

    const ratios = new Map<string, number>();

    try {
      this.observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            ratios.set(
              (entrada.target as HTMLElement).id,
              entrada.isIntersecting ? entrada.intersectionRatio : 0,
            );
          }

          if (this.sincronizacionPausada) {
            return;
          }

          const activa = this.elegirSeccionActiva(seccionesVisibles, ratios);
          if (activa) {
            this.seccionActiva.set(activa);
          }
        },
        {
          rootMargin: '-18% 0px -62% 0px',
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );
    } catch {
      return;
    }

    seccionesVisibles.forEach((seccion) => this.observador?.observe(seccion));
  }

  /**
   * @function elegirSeccionActiva
   * @description Elige la sección visible cuya parte superior queda más cerca del encabezado.
   * @param secciones Secciones con identificador en el documento.
   * @param ratios Proporción visible reportada por el observador.
   * @returns Identificador de la sección activa, o null si ninguna aplica.
   */
  private elegirSeccionActiva(
    secciones: readonly HTMLElement[],
    ratios: ReadonlyMap<string, number>,
  ): string | null {
    const desplazamientoEncabezado = 72;
    let mejor: { id: string; distancia: number } | null = null;

    for (const seccion of secciones) {
      if ((ratios.get(seccion.id) ?? 0) <= 0) {
        continue;
      }

      const rect = seccion.getBoundingClientRect();
      if (rect.bottom <= desplazamientoEncabezado) {
        continue;
      }

      const distancia = Math.abs(rect.top - desplazamientoEncabezado);
      if (!mejor || distancia < mejor.distancia) {
        mejor = { id: seccion.id, distancia };
      }
    }

    return mejor?.id ?? null;
  }

  /**
   * @function bloquearDesplazamientoFondo
   * @description Congela el scroll de la página detrás del menú móvil, también en iOS.
   * @param abierto Indica si el menú quedó abierto.
   */
  private bloquearDesplazamientoFondo(abierto: boolean): void {
    const html = this.documento.documentElement;
    const cuerpo = this.documento.body;
    const vista = this.documento.defaultView;

    if (abierto) {
      if (this.fondoBloqueado) {
        return;
      }

      this.desplazamientoBloqueado = vista?.scrollY ?? 0;
      this.fondoBloqueado = true;
      html.classList.add('menu-movil-abierto');
      cuerpo.classList.add('menu-movil-abierto');
      cuerpo.style.position = 'fixed';
      cuerpo.style.top = `-${this.desplazamientoBloqueado}px`;
      cuerpo.style.left = '0';
      cuerpo.style.right = '0';
      cuerpo.style.width = '100%';
      cuerpo.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      this.documento.addEventListener('touchmove', this.impedirToqueFondo, {
        passive: false,
      });
      return;
    }

    if (!this.fondoBloqueado) {
      return;
    }

    this.documento.removeEventListener('touchmove', this.impedirToqueFondo);
    html.classList.remove('menu-movil-abierto');
    cuerpo.classList.remove('menu-movil-abierto');
    cuerpo.style.position = '';
    cuerpo.style.top = '';
    cuerpo.style.left = '';
    cuerpo.style.right = '';
    cuerpo.style.width = '';
    cuerpo.style.overflow = '';
    html.style.overflow = '';
    this.fondoBloqueado = false;
    vista?.scrollTo({ top: this.desplazamientoBloqueado, behavior: 'instant' });
  }

  /**
   * @function impedirToqueFondo
   * @description Evita que el gesto táctil mueva la página fuera del panel del menú.
   * @param evento Evento táctil del documento.
   */
  private readonly impedirToqueFondo = (evento: TouchEvent): void => {
    const objetivo = evento.target as Node | null;
    const panel = this.anfitrion.nativeElement.querySelector('.menu__panel');
    if (panel && objetivo && panel.contains(objetivo)) {
      return;
    }
    evento.preventDefault();
  };

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

  /**
   * @function obtenerFocoables
   * @description Lista los controles del encabezado que pueden recibir Tab con el menú abierto.
   * @returns Elementos enfocables visibles.
   */
  private obtenerFocoables(): HTMLElement[] {
    const raiz = this.anfitrion.nativeElement as HTMLElement;
    return [
      ...(raiz.querySelectorAll(
        '.encabezado__abrir, .menu--abierto .menu__cerrar, .menu--abierto a[href], .menu--abierto button:not([disabled])',
      ) as NodeListOf<HTMLElement>),
    ].filter((elemento) => {
      if (elemento.getAttribute('aria-hidden') === 'true') {
        return false;
      }
      const estilo = getComputedStyle(elemento);
      return estilo.display !== 'none' && estilo.visibility !== 'hidden';
    });
  }

  /**
   * @function enfocarPrimerEnlace
   * @description Lleva el foco al primer enlace de sección al abrir el menú.
   */
  private enfocarPrimerEnlace(): void {
    const raiz = this.anfitrion.nativeElement as HTMLElement;
    const primerEnlace = raiz.querySelector('.menu--abierto .menu__enlace') as HTMLElement | null;
    primerEnlace?.focus();
  }
}
