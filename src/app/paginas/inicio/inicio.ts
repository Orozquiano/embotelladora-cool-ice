import { Component } from '@angular/core';
import { SeccionCalidad } from '../../secciones/seccion-calidad/seccion-calidad';
import { SeccionContacto } from '../../secciones/seccion-contacto/seccion-contacto';
import { SeccionInicio } from '../../secciones/seccion-inicio/seccion-inicio';
import { SeccionNosotros } from '../../secciones/seccion-nosotros/seccion-nosotros';
import { SeccionProductos } from '../../secciones/seccion-productos/seccion-productos';

/**
 * @class Inicio
 * @description Página principal, organizada por secciones enlazables.
 */
@Component({
  selector: 'app-inicio',
  imports: [SeccionInicio, SeccionProductos, SeccionCalidad, SeccionNosotros, SeccionContacto],
  templateUrl: './inicio.html',
})
export class Inicio {}
