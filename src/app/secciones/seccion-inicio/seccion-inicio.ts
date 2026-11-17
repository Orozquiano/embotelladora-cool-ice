import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { estadisticasHero, imagenHero, lineaPedidos } from '../../contenido/sitio';
import { ImagenEsqueleto } from '../../directivas/imagen-esqueleto';
import { RevelarAlScroll } from '../../directivas/revelar-al-scroll';
import { AguaLienzo } from '../../visual/agua-lienzo/agua-lienzo';

/**
 * @class SeccionInicio
 * @description Apertura inmersiva con agua animada y marca Cool Ice.
 */
@Component({
  selector: 'app-seccion-inicio',
  imports: [RouterLink, NgOptimizedImage, ImagenEsqueleto, AguaLienzo, RevelarAlScroll],
  templateUrl: './seccion-inicio.html',
})
export class SeccionInicio {
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
   * @description Estadísticas bajo la composición principal del hero.
   */
  protected readonly estadisticas = estadisticasHero;
}
