import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  correo,
  lineasTelefonicas,
  logo,
  nombreEmpresa,
  secciones,
} from '../../contenido/sitio';

/**
 * @class Pie
 * @description Cierre de la página con la marca, las secciones y los canales publicados.
 */
@Component({
  selector: 'app-pie',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './pie.html',
})
export class Pie {
  /**
   * @description Nombre legal de la embotelladora.
   */
  protected readonly empresa = nombreEmpresa;

  /**
   * @description Secciones repetidas al final de la página.
   */
  protected readonly secciones = secciones;

  /**
   * @description Teléfonos disponibles.
   */
  protected readonly lineas = lineasTelefonicas;

  /**
   * @description Correo de pedidos.
   */
  protected readonly correo = correo;

  /**
   * @description Logotipo, decorativo porque el nombre va en texto.
   */
  protected readonly logo = logo;

  /**
   * @description Año del aviso de derechos.
   */
  protected readonly anio = new Date().getFullYear();
}
