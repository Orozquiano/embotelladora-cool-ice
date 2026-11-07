import { Component } from '@angular/core';
import { SeccionBeneficios } from '../../secciones/seccion-beneficios/seccion-beneficios';
import { SeccionCalidad } from '../../secciones/seccion-calidad/seccion-calidad';
import { SeccionConfianza } from '../../secciones/seccion-confianza/seccion-confianza';
import { SeccionContacto } from '../../secciones/seccion-contacto/seccion-contacto';
import { SeccionInicio } from '../../secciones/seccion-inicio/seccion-inicio';
import { SeccionNosotros } from '../../secciones/seccion-nosotros/seccion-nosotros';
import { SeccionProductos } from '../../secciones/seccion-productos/seccion-productos';

/**
 * @class Inicio
 * @description Página principal, organizada por secciones enlazables del Figma.
 */
@Component({
  selector: 'app-inicio',
  imports: [
    SeccionInicio,
    SeccionBeneficios,
    SeccionProductos,
    SeccionCalidad,
    SeccionNosotros,
    SeccionConfianza,
    SeccionContacto,
  ],
  templateUrl: './inicio.html',
})
export class Inicio {}
