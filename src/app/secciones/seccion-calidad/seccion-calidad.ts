import { Component } from '@angular/core';
import { etapasProceso, hitosProceso } from '../../contenido/sitio';

/**
 * @class SeccionCalidad
 * @description Explica el proceso real de purificación con flujo visual por etapas.
 */
@Component({
  selector: 'app-seccion-calidad',
  templateUrl: './seccion-calidad.html',
})
export class SeccionCalidad {
  /**
   * @description Etapas numeradas del tratamiento en planta.
   */
  protected readonly etapas = etapasProceso;

  /**
   * @description Hitos de valor del proceso.
   */
  protected readonly hitos = hitosProceso;
}
