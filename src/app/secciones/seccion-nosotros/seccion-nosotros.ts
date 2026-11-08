import { Component } from '@angular/core';
import { datosOrigen, datosServicio } from '../../contenido/sitio';

/**
 * @class SeccionNosotros
 * @description Servicio a domicilio y cobertura de origen.
 */
@Component({
  selector: 'app-seccion-nosotros',
  templateUrl: './seccion-nosotros.html',
})
export class SeccionNosotros {
  /**
   * @description Celdas del panel de servicio.
   */
  protected readonly servicio = datosServicio;

  /**
   * @description Filas de cobertura y origen.
   */
  protected readonly origen = datosOrigen;
}
