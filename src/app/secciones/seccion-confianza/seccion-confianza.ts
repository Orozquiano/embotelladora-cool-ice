import { Component } from '@angular/core';
import { nombreEmpresa, pilaresConfianza, registroInvima } from '../../contenido/sitio';

/**
 * @class SeccionConfianza
 * @description Argumentos de respaldo sanitario, origen y uso familiar.
 */
@Component({
  selector: 'app-seccion-confianza',
  templateUrl: './seccion-confianza.html',
})
export class SeccionConfianza {
  /**
   * @description Pilares de confianza.
   */
  protected readonly pilares = pilaresConfianza;

  /**
   * @description Nombre legal de la embotelladora.
   */
  protected readonly empresa = nombreEmpresa;

  /**
   * @description Registro INVIMA publicado.
   */
  protected readonly registro = registroInvima;
}
