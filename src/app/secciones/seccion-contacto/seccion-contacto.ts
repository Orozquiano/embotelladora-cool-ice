import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  correo,
  enlaceWhatsapp,
  lineaPedidos,
  lugar,
  nombreEmpresa,
  registroInvima,
} from '../../contenido/sitio';

/**
 * @class SeccionContacto
 * @description Canales de contacto y formulario que abre WhatsApp con el pedido.
 */
@Component({
  selector: 'app-seccion-contacto',
  imports: [RouterLink],
  templateUrl: './seccion-contacto.html',
})
export class SeccionContacto {
  /**
   * @description WhatsApp de pedidos.
   */
  protected readonly whatsappBase = lineaPedidos;

  /**
   * @description Correo de la embotelladora.
   */
  protected readonly correo = correo;

  /**
   * @description Lugar publicado.
   */
  protected readonly lugar = lugar;

  /**
   * @description Nombre legal.
   */
  protected readonly empresa = nombreEmpresa;

  /**
   * @description Registro sanitario INVIMA publicado en etiqueta.
   */
  protected readonly registroInvima = registroInvima;

  /**
   * @description Nombre del solicitante.
   */
  protected readonly nombre = signal('');

  /**
   * @description Teléfono del solicitante.
   */
  protected readonly telefono = signal('');

  /**
   * @description Dirección de entrega.
   */
  protected readonly direccion = signal('');

  /**
   * @description Cantidad de bidones.
   */
  protected readonly cantidad = signal('1');

  /**
   * @description Mensaje opcional.
   */
  protected readonly mensaje = signal('');

  /**
   * @description Enlace de WhatsApp armado con los datos del formulario.
   */
  protected readonly enlacePedido = computed(() => {
    const partes = [
      'Hola, quiero solicitar un pedido Cool Ice.',
      this.nombre().trim() ? `Nombre: ${this.nombre().trim()}` : null,
      this.telefono().trim() ? `WhatsApp/Teléfono: ${this.telefono().trim()}` : null,
      this.direccion().trim() ? `Dirección: ${this.direccion().trim()}` : null,
      `Cantidad de bidones 18,9 L: ${this.cantidad().trim() || '1'}`,
      this.mensaje().trim() ? `Mensaje: ${this.mensaje().trim()}` : null,
    ].filter((parte): parte is string => !!parte);

    return enlaceWhatsapp('3216820822', partes.join('\n'));
  });
}
