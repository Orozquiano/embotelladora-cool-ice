import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  camposPorCompletar,
  imagenReparto,
  lugar,
  nombreEmpresa,
  textoPublicado,
} from '../../contenido/sitio';

/**
 * @class SeccionNosotros
 * @description Presenta la embotelladora con los datos que ya están publicados en sus piezas.
 */
@Component({
  selector: 'app-seccion-nosotros',
  imports: [NgOptimizedImage],
  templateUrl: './seccion-nosotros.html',
})
export class SeccionNosotros {
  /**
   * @description Nombre legal.
   */
  protected readonly empresa = nombreEmpresa;

  /**
   * @description Municipio y departamento.
   */
  protected readonly lugar = lugar;

  /**
   * @description Ilustración del reparto.
   */
  protected readonly imagen = imagenReparto;

  /**
   * @description Historia redactada por la empresa, si ya existe.
   */
  protected readonly historia = textoPublicado(camposPorCompletar.historia);

  /**
   * @description Valores redactados por la empresa, si ya existen.
   */
  protected readonly valores = textoPublicado(camposPorCompletar.valores);

  /**
   * @description NIT, si ya fue diligenciado.
   */
  protected readonly nit = textoPublicado(camposPorCompletar.nit);
}
