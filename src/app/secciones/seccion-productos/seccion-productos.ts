import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { productos } from '../../contenido/productos';

/**
 * @class SeccionProductos
 * @description Lista las presentaciones disponibles con su imagen y sus datos.
 */
@Component({
  selector: 'app-seccion-productos',
  imports: [NgOptimizedImage],
  templateUrl: './seccion-productos.html',
})
export class SeccionProductos {
  /**
   * @description Presentaciones publicadas en el archivo de contenido.
   */
  protected readonly productos = productos;
}
