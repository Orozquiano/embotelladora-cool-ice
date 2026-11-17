import { Component, signal } from '@angular/core';
import { etapasProceso, hitosProceso } from '../../contenido/sitio';
import { FaseAlScroll } from '../../directivas/fase-al-scroll';
import { RevelarAlScroll } from '../../directivas/revelar-al-scroll';
import { CascadaAgua } from '../../visual/cascada-agua/cascada-agua';
import { OndasAgua } from '../../visual/ondas-agua/ondas-agua';

/**
 * @class SeccionCalidad
 * @description Explica el proceso real de purificación con flujo visual por etapas.
 */
@Component({
  selector: 'app-seccion-calidad',
  imports: [RevelarAlScroll, FaseAlScroll, OndasAgua, CascadaAgua],
  templateUrl: './seccion-calidad.html',
})
export class SeccionCalidad {
  /**
   * @description Etapas numeradas del tratamiento en planta.
   */
  protected readonly etapas = etapasProceso;

  /**
   * @description Hitos de valor del proceso.
   */
  protected readonly hitos = hitosProceso;

  /**
   * @description Fase visible actual (para sincronizar la cascada).
   */
  protected readonly faseActiva = signal(0);

  /**
   * @description Actualiza la fase activa al hacer scroll por cada paso.
   */
  protected onFase(indice: number): void {
    this.faseActiva.set(indice);
  }
}
