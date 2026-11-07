import { Component } from '@angular/core';
import { beneficios } from '../../contenido/sitio';

/**
 * @class SeccionBeneficios
 * @description Tres razones de valor centradas bajo el hero.
 */
@Component({
  selector: 'app-seccion-beneficios',
  templateUrl: './seccion-beneficios.html',
})
export class SeccionBeneficios {
  /**
   * @description Beneficios publicados en el contenido.
   */
  protected readonly beneficios = beneficios;
}
