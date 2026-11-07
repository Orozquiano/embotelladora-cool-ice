import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { beneficios, imagenHero, lineaPedidos, nombreEmpresa } from '../../contenido/sitio';

/**
 * @class SeccionInicio
 * @description Apertura de la página: propuesta de la empresa y producto principal.
 */
@Component({
  selector: 'app-seccion-inicio',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './seccion-inicio.html',
})
export class SeccionInicio {
  /**
   * @description Nombre legal incluido en el texto de apertura.
   */
  protected readonly empresa = nombreEmpresa;

  /**
   * @description Fotografía principal del botellón.
   */
  protected readonly imagen = imagenHero;

  /**
   * @description WhatsApp de pedidos.
   */
  protected readonly whatsapp = lineaPedidos.whatsapp;

  /**
   * @description Tres mensajes de valor de la propuesta visual.
   */
  protected readonly beneficios = beneficios;
}
