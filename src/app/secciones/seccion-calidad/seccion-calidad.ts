import { Component } from '@angular/core';
import {
  camposPorCompletar,
  conservacionBotella,
  conservacionBotellon,
  datosDeEtiqueta,
  textoPublicado,
} from '../../contenido/sitio';

/**
 * @class SeccionCalidad
 * @description Explica lo que las etiquetas declaran y cómo conservar el producto.
 */
@Component({
  selector: 'app-seccion-calidad',
  templateUrl: './seccion-calidad.html',
})
export class SeccionCalidad {
  /**
   * @description Datos impresos en las etiquetas.
   */
  protected readonly datos = datosDeEtiqueta;

  /**
   * @description Conservación del botellón.
   */
  protected readonly conservacionBotellon = conservacionBotellon;

  /**
   * @description Conservación de la botella.
   */
  protected readonly conservacionBotella = conservacionBotella;

  /**
   * @description Etapas del tratamiento, si la empresa ya las redactó.
   */
  protected readonly etapas = textoPublicado(camposPorCompletar.etapasTratamiento);
}
