import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  detallesProducto,
  imagenProducto,
  lineaPedidos,
} from '../../contenido/sitio';
import { ImagenEsqueleto } from '../../directivas/imagen-esqueleto';

/**
 * @class SeccionProductos
 * @description Destaca el bidón familiar de 18,9 L según el Figma.
 */
@Component({
  selector: 'app-seccion-productos',
  imports: [NgOptimizedImage, ImagenEsqueleto],
  templateUrl: './seccion-productos.html',
})
export class SeccionProductos {
  /**
   * @description Imagen de la etiqueta del producto estrella.
   */
  protected readonly imagen = imagenProducto;

  /**
   * @description Lista de atributos del bidón.
   */
  protected readonly detalles = detallesProducto;

  /**
   * @description WhatsApp para solicitar domicilio.
   */
  protected readonly whatsapp = lineaPedidos.whatsapp;
}
