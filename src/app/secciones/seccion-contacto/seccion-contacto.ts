import { Component } from '@angular/core';
import {
  camposPorCompletar,
  correo,
  lineasTelefonicas,
  lugar,
  textoPublicado,
} from '../../contenido/sitio';

/**
 * @class SeccionContacto
 * @description Muestra los canales reales de contacto, sin un formulario de envío.
 */
@Component({
  selector: 'app-seccion-contacto',
  templateUrl: './seccion-contacto.html',
})
export class SeccionContacto {
  /**
   * @description Teléfonos publicados.
   */
  protected readonly lineas = lineasTelefonicas;

  /**
   * @description Correo de la embotelladora.
   */
  protected readonly correo = correo;

  /**
   * @description Lugar que ya figura en la etiqueta.
   */
  protected readonly lugar = lugar;

  /**
   * @description Dirección exacta, si ya fue diligenciada.
   */
  protected readonly direccion = textoPublicado(camposPorCompletar.direccionExacta);

  /**
   * @description Horario, si ya fue diligenciado.
   */
  protected readonly horario = textoPublicado(camposPorCompletar.horario);

  /**
   * @description Cobertura del domicilio, si ya fue diligenciada.
   */
  protected readonly cobertura = textoPublicado(camposPorCompletar.cobertura);
}
