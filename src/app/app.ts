import { Component, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Encabezado } from './layout/encabezado/encabezado';
import { Pie } from './layout/pie/pie';

/**
 * @class App
 * @description Cascarón del sitio: salto al contenido, navegación, página y pie.
 */
@Component({
  imports: [RouterOutlet, Encabezado, Pie],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * @description Desplazamiento de la ventana, ajustado para no ocultar las secciones bajo el encabezado.
   */
  private readonly desplazamiento = inject(ViewportScroller);

  constructor() {
    this.desplazamiento.setOffset([0, 88]);
  }
}
