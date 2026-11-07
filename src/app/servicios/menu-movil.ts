import { Injectable, signal } from '@angular/core';

/**
 * @class MenuMovil
 * @description Estado compartido del menú estrecho, para bloquear el resto de la página.
 */
@Injectable({ providedIn: 'root' })
export class MenuMovil {
  /**
   * @description Indica si el menú estrecho está abierto.
   */
  readonly abierto = signal(false);

  /**
   * @function alternar
   * @description Abre o cierra el menú.
   */
  alternar(): void {
    this.abierto.update((abierto) => !abierto);
  }

  /**
   * @function cerrar
   * @description Cierra el menú.
   */
  cerrar(): void {
    this.abierto.set(false);
  }
}
