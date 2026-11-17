import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { estadisticasHero, lineaPedidos } from '../../contenido/sitio';
import { RevelarAlScroll } from '../../directivas/revelar-al-scroll';
import { AguaLienzo } from '../../visual/agua-lienzo/agua-lienzo';

/**
 * @class SeccionInicio
 * @description Apertura centrada en el mensaje de marca, con agua animada de fondo.
 */
@Component({
  selector: 'app-seccion-inicio',
  imports: [RouterLink, AguaLienzo, RevelarAlScroll],
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
