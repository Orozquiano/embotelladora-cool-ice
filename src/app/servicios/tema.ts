import { DOCUMENT } from '@angular/core';
import { Injectable, computed, inject, signal } from '@angular/core';

/**
 * @description Preferencia de apariencia guardada por el usuario.
 */
export type PreferenciaTema = 'sistema' | 'claro' | 'oscuro';

/**
 * @description Apariencia efectiva aplicada al documento.
 */
export type AparienciaTema = 'claro' | 'oscuro';

const CLAVE_TEMA = 'cool-ice-tema';

/**
 * @class Tema
 * @description Gestiona claro/oscuro con sistema como valor por defecto.
 */
@Injectable({ providedIn: 'root' })
export class Tema {
  private readonly documento = inject(DOCUMENT);

  /**
   * @description Preferencia del usuario (sistema por defecto).
   */
  readonly preferencia = signal<PreferenciaTema>(this.leerPreferencia());

  /**
   * @description Apariencia efectiva según preferencia y sistema.
   */
  readonly apariencia = computed<AparienciaTema>(() => {
    const preferencia = this.preferencia();
    if (preferencia === 'claro' || preferencia === 'oscuro') {
      return preferencia;
    }
    return this.sistemaEsOscuro() ? 'oscuro' : 'claro';
  });

  /**
   * @description Etiqueta corta para el control de tema.
   */
  readonly etiqueta = computed(() => {
    switch (this.preferencia()) {
      case 'claro':
        return 'Claro';
      case 'oscuro':
        return 'Oscuro';
      default:
        return 'Sistema';
    }
  });

  constructor() {
    this.aplicar(this.preferencia());
  }

  /**
   * @function fijar
   * @description Guarda y aplica una preferencia concreta.
   */
  fijar(preferencia: PreferenciaTema): void {
    this.preferencia.set(preferencia);
    this.guardar(preferencia);
    this.aplicar(preferencia);
  }

  /**
   * @function ciclar
   * @description Alterna entre sistema → claro → oscuro → sistema.
   */
  ciclar(): void {
    const orden: PreferenciaTema[] = ['sistema', 'claro', 'oscuro'];
    const actual = this.preferencia();
    const siguiente = orden[(orden.indexOf(actual) + 1) % orden.length] ?? 'sistema';
    this.fijar(siguiente);
  }

  /**
   * @function sistemaEsOscuro
   * @description Lee la preferencia del sistema operativo.
   */
  private sistemaEsOscuro(): boolean {
    const vista = this.documento.defaultView;
    return !!vista?.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  }

  /**
   * @function leerPreferencia
   * @description Recupera la preferencia persistida o usa sistema.
   */
  private leerPreferencia(): PreferenciaTema {
    try {
      const valor = this.documento.defaultView?.localStorage.getItem(CLAVE_TEMA);
      if (valor === 'claro' || valor === 'oscuro' || valor === 'sistema') {
        return valor;
      }
    } catch {
      // Sin acceso a storage: se mantiene sistema.
    }
    return 'sistema';
  }

  /**
   * @function guardar
   * @description Persiste la preferencia en localStorage.
   */
  private guardar(preferencia: PreferenciaTema): void {
    try {
      this.documento.defaultView?.localStorage.setItem(CLAVE_TEMA, preferencia);
    } catch {
      // Ignorar restricciones de almacenamiento.
    }
  }

  /**
   * @function aplicar
   * @description Escribe data-tema y actualiza theme-color.
   */
  private aplicar(preferencia: PreferenciaTema): void {
    const html = this.documento.documentElement;
    html.dataset['tema'] = preferencia;

    const meta = this.documento.querySelector('meta[name="theme-color"]');
    if (meta) {
      const estilos = this.documento.defaultView?.getComputedStyle(html);
      const color = estilos?.getPropertyValue('--theme-color').trim() || '#0b4f8c';
      meta.setAttribute('content', color);
    }
  }
}
