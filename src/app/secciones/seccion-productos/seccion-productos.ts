import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  detallesProducto,
  imagenBotellon,
  imagenProducto,
  lineaPedidos,
} from '../../contenido/sitio';
import { ImagenEsqueleto } from '../../directivas/imagen-esqueleto';
import { RevelarAlScroll } from '../../directivas/revelar-al-scroll';

/**
 * @class SeccionProductos
 * @description Destaca el bidón familiar de 18,9 L con recursos oficiales.
 */
@Component({
  selector: 'app-seccion-productos',
  imports: [NgOptimizedImage, ImagenEsqueleto, RevelarAlScroll],
  templateUrl: './seccion-productos.html',
})
export class SeccionProductos {
  /**
   * @description Fotografía del botellón completo.
   */
  protected readonly botellon = imagenBotellon;

  /**
   * @description Etiqueta oficial del producto estrella.
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
