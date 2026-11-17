import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  correo,
  lineaPedidos,
  lugar,
  nombreEmpresa,
  registroInvima,
} from '../../contenido/sitio';
import {
  ErroresPedido,
  enlacePedidoWhatsapp,
  formularioVacioErrores,
  validarPedido,
} from '../../contenido/pedido-whatsapp';
import { OndasAgua } from '../../visual/ondas-agua/ondas-agua';

/**
 * @class SeccionContacto
 * @description Canales de contacto y formulario que abre WhatsApp solo con datos válidos.
 */
@Component({
  selector: 'app-seccion-contacto',
  imports: [RouterLink, OndasAgua],
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
   * @description Errores visibles tras un intento de envío o al corregir campos.
   */
  protected readonly errores = signal<ErroresPedido>(formularioVacioErrores());

  /**
   * @description Indica si ya se intentó enviar con el formulario incompleto.
   */
  protected readonly intentoEnvio = signal(false);

  /**
   * @description Resultado de validación reactivo sobre los campos actuales.
   */
  private readonly validacion = computed(() =>
    validarPedido({
      nombre: this.nombre(),
      telefono: this.telefono(),
      direccion: this.direccion(),
      cantidad: this.cantidad(),
      mensaje: this.mensaje(),
    }),
  );

  /**
   * @description True cuando el pedido cumple todas las reglas.
   */
  protected readonly pedidoValido = computed(() => this.validacion().ok);

  /**
   * @description Enlace de WhatsApp solo si el pedido es válido; si no, ancla inerte.
   */
  protected readonly enlacePedido = computed(() => {
    const resultado = this.validacion();
    if (!resultado.ok) {
      return '#contacto';
    }
    return enlacePedidoWhatsapp('3216820822', resultado.pedido);
  });

  /**
   * @function actualizarCampo
   * @description Actualiza un campo y refresca errores si ya hubo un intento de envío.
   */
  protected actualizarCampo(
    campo: 'nombre' | 'telefono' | 'direccion' | 'cantidad' | 'mensaje',
    valor: string,
  ): void {
    this[campo].set(valor);
    if (this.intentoEnvio()) {
      this.sincronizarErrores();
    }
  }

  /**
   * @function enviarPedido
   * @description Valida el formulario; solo deja abrir WhatsApp cuando es válido.
   */
  protected enviarPedido(evento: Event): void {
    evento.preventDefault();
    this.intentoEnvio.set(true);
    this.sincronizarErrores();

    const resultado = this.validacion();
    if (!resultado.ok) {
      return;
    }

    const url = enlacePedidoWhatsapp('3216820822', resultado.pedido);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * @function sincronizarErrores
   * @description Copia los errores de la validación actual al estado visible.
   */
  private sincronizarErrores(): void {
    const resultado = this.validacion();
    if (resultado.ok) {
      this.errores.set(formularioVacioErrores());
      return;
    }
    this.errores.set(resultado.errores);
  }
}
