import { Component } from '@angular/core';
import { detallesProducto, lineaPedidos } from '../../contenido/sitio';
import { RevelarAlScroll } from '../../directivas/revelar-al-scroll';
import { Botellon3d } from '../../visual/botellon-3d/botellon-3d';

/**
 * @class SeccionProductos
 * @description Destaca el bidón familiar de 18,9 L con modelo 3D interactivo.
 */
@Component({
  selector: 'app-seccion-productos',
  imports: [Botellon3d, RevelarAlScroll],
  templateUrl: './seccion-productos.html',
})
export class SeccionProductos {
  /**
   * @description Lista de atributos del bidón.
   */
  protected readonly detalles = detallesProducto;

  /**
   * @description WhatsApp para solicitar domicilio.
   */
  protected readonly whatsapp = lineaPedidos.whatsapp;
}
