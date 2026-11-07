import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import {
  camposPorCompletar,
  imagenReparto,
  lineaDispensadores,
  lineaPedidos,
  lugar,
  nombreEmpresa,
  textoPublicado,
} from '../../contenido/sitio';
import { ImagenEsqueleto } from '../../directivas/imagen-esqueleto';

/**
 * @class SeccionNosotros
 * @description Presenta la embotelladora con los datos que ya están publicados en sus piezas.
 */
@Component({
  selector: 'app-seccion-nosotros',
  imports: [NgOptimizedImage, ImagenEsqueleto],
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
   * @description Número de pedidos visible.
   */
  protected readonly telefonoPedidos = lineaPedidos.visible;

  /**
   * @description Número de dispensadores visible.
   */
  protected readonly telefonoDispensadores = lineaDispensadores.visible;

  /**
   * @description Cobertura, si ya fue redactada.
   */
  protected readonly cobertura = textoPublicado(camposPorCompletar.cobertura);

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
