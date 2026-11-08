import { Component } from '@angular/core';
import { etapasProceso } from '../../contenido/sitio';

/**
 * @class SeccionCalidad
 * @description Presenta el proceso de purificación en cuatro etapas.
 */
@Component({
  selector: 'app-seccion-calidad',
  templateUrl: './seccion-calidad.html',
})
export class SeccionCalidad {
  /**
   * @description Etapas numeradas del proceso.
   */
  protected readonly etapas = etapasProceso;
}
