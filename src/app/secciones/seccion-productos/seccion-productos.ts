import { LowerCasePipe, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Producto } from '../../contenido/modelos';
import { enlaceWhatsappProducto, productos } from '../../contenido/productos';
import { ImagenEsqueleto } from '../../directivas/imagen-esqueleto';

/**
 * @class SeccionProductos
 * @description Lista las presentaciones disponibles con su imagen y sus datos.
 */
@Component({
  selector: 'app-seccion-productos',
  imports: [NgOptimizedImage, LowerCasePipe, ImagenEsqueleto],
  templateUrl: './seccion-productos.html',
})
export class SeccionProductos {
  /**
   * @description Presentaciones publicadas en el archivo de contenido.
   */
  protected readonly productos = productos;

  /**
   * @function whatsappDe
   * @description Enlace de WhatsApp con mensaje propio de cada presentación.
   * @param producto Presentación consultada.
   * @returns URL de wa.me.
   */
  protected whatsappDe(producto: Producto): string {
    return enlaceWhatsappProducto(producto);
  }
}
