import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { estadisticasHero, lineaPedidos } from '../../contenido/sitio';
import { RevelarAlScroll } from '../../directivas/revelar-al-scroll';
import { AguaLienzo } from '../../visual/agua-lienzo/agua-lienzo';
import { Botellon3d } from '../../visual/botellon-3d/botellon-3d';

/**
 * @class SeccionInicio
 * @description Apertura inmersiva con agua animada y porrón 3D interactivo.
 */
@Component({
  selector: 'app-seccion-inicio',
  imports: [RouterLink, AguaLienzo, Botellon3d, RevelarAlScroll],
  templateUrl: './seccion-inicio.html',
})
export class SeccionInicio {
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
