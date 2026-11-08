import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  estadisticasHero,
  imagenHero,
  lineaPedidos,
  nombreEmpresa,
} from '../../contenido/sitio';
import { ImagenEsqueleto } from '../../directivas/imagen-esqueleto';

/**
 * @class SeccionInicio
 * @description Apertura de la página según el layout del Figma.
 */
@Component({
  selector: 'app-seccion-inicio',
  imports: [RouterLink, NgOptimizedImage, ImagenEsqueleto],
  templateUrl: './seccion-inicio.html',
})
export class SeccionInicio {
  /**
   * @description Nombre legal incluido en el texto de apertura.
   */
  protected readonly empresa = nombreEmpresa;

  /**
   * @description Marca visual del hero.
   */
  protected readonly imagen = imagenHero;

  /**
   * @description WhatsApp de pedidos.
   */
  protected readonly whatsapp = lineaPedidos.whatsapp;

  /**
   * @description Teléfono visible en el CTA principal.
   */
  protected readonly telefono = lineaPedidos.visible;

  /**
   * @description Estadísticas bajo los botones del hero.
   */
  protected readonly estadisticas = estadisticasHero;
}
