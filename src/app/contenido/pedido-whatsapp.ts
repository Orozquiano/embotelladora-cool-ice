import { enlaceWhatsapp } from './sitio';

/**
 * @description Límites configurables del pedido por WhatsApp.
 */
export const limitesPedido = {
  nombreMin: 2,
  nombreMax: 80,
  direccionMin: 5,
  direccionMax: 160,
  mensajeMax: 400,
  cantidadMin: 1,
  cantidadMax: 50,
} as const;

/**
 * @description Errores de validación del formulario de pedido.
 */
export type ErroresPedido = {
  nombre: string | null;
  telefono: string | null;
  direccion: string | null;
  cantidad: string | null;
  mensaje: string | null;
};

/**
 * @description Datos normalizados listos para armar el mensaje.
 */
export type PedidoNormalizado = {
  nombre: string;
  telefono: string;
  telefonoVisible: string;
  direccion: string;
  cantidad: number;
  mensaje: string;
};

/**
 * @function limpiarEspacios
 * @description Colapsa espacios internos y recorta extremos.
 */
export function limpiarEspacios(valor: string): string {
  return valor.replace(/\s+/g, ' ').trim();
}

/**
 * @function normalizarTelefonoColombia
 * @description Extrae dígitos y valida un celular o fijo colombiano usable en WhatsApp.
 * Acepta 10 dígitos locales (3xx…) o con prefijo 57.
 */
export function normalizarTelefonoColombia(valor: string): string | null {
  const digitos = valor.replace(/\D/g, '');
  if (digitos.length === 10 && /^[36]\d{9}$/.test(digitos)) {
    return digitos;
  }
  if (digitos.length === 12 && digitos.startsWith('57') && /^57[36]\d{9}$/.test(digitos)) {
    return digitos.slice(2);
  }
  return null;
}

/**
 * @function formatearTelefonoVisible
 * @description Presenta el celular colombiano con espacios legibles.
 */
export function formatearTelefonoVisible(digitos: string): string {
  if (digitos.length !== 10) {
    return digitos;
  }
  return `${digitos.slice(0, 3)} ${digitos.slice(3, 6)} ${digitos.slice(6)}`;
}

/**
 * @function parsearCantidad
 * @description Interpreta la cantidad como entero positivo dentro del rango.
 */
export function parsearCantidad(
  valor: string,
  minimo = limitesPedido.cantidadMin,
  maximo = limitesPedido.cantidadMax,
): number | null {
  const limpio = valor.replace(/\s+/g, '').replace(',', '.');
  if (!/^\d+$/.test(limpio)) {
    return null;
  }
  const entero = Number.parseInt(limpio, 10);
  if (!Number.isFinite(entero) || entero < minimo || entero > maximo) {
    return null;
  }
  return entero;
}

/**
 * @function validarPedido
 * @description Valida y normaliza el pedido. No abre WhatsApp si hay errores.
 */
export function validarPedido(entrada: {
  nombre: string;
  telefono: string;
  direccion: string;
  cantidad: string;
  mensaje: string;
}): { ok: true; pedido: PedidoNormalizado } | { ok: false; errores: ErroresPedido } {
  const nombre = limpiarEspacios(entrada.nombre);
  const direccion = limpiarEspacios(entrada.direccion);
  const mensaje = limpiarEspacios(entrada.mensaje);
  const telefonoDigitos = normalizarTelefonoColombia(entrada.telefono);
  const cantidad = parsearCantidad(entrada.cantidad);

  const errores: ErroresPedido = {
    nombre: null,
    telefono: null,
    direccion: null,
    cantidad: null,
    mensaje: null,
  };

  if (nombre.length < limitesPedido.nombreMin) {
    errores.nombre = 'Escribe tu nombre completo.';
  } else if (nombre.length > limitesPedido.nombreMax) {
    errores.nombre = `El nombre no puede superar ${limitesPedido.nombreMax} caracteres.`;
  }

  if (!telefonoDigitos) {
    errores.telefono = 'Ingresa un celular colombiano válido (10 dígitos, ej. 300 000 0000).';
  }

  if (direccion.length < limitesPedido.direccionMin) {
    errores.direccion = 'Indica la dirección o barrio de entrega.';
  } else if (direccion.length > limitesPedido.direccionMax) {
    errores.direccion = `La dirección no puede superar ${limitesPedido.direccionMax} caracteres.`;
  }

  if (cantidad === null) {
    errores.cantidad = `La cantidad debe ser un número entero entre ${limitesPedido.cantidadMin} y ${limitesPedido.cantidadMax}.`;
  }

  if (mensaje.length > limitesPedido.mensajeMax) {
    errores.mensaje = `El mensaje no puede superar ${limitesPedido.mensajeMax} caracteres.`;
  }

  const hayErrores = Object.values(errores).some((error) => error !== null);
  if (hayErrores || !telefonoDigitos || cantidad === null) {
    return { ok: false, errores };
  }

  return {
    ok: true,
    pedido: {
      nombre,
      telefono: telefonoDigitos,
      telefonoVisible: formatearTelefonoVisible(telefonoDigitos),
      direccion,
      cantidad,
      mensaje,
    },
  };
}

/**
 * @function construirMensajePedido
 * @description Arma el texto legible del chat de WhatsApp.
 */
export function construirMensajePedido(pedido: PedidoNormalizado): string {
  const lineas = [
    'Hola, quiero solicitar un pedido Cool Ice.',
    `Nombre: ${pedido.nombre}`,
    `WhatsApp/Teléfono: ${pedido.telefonoVisible}`,
    `Dirección: ${pedido.direccion}`,
    `Cantidad de bidones 18,9 L: ${pedido.cantidad}`,
  ];
  if (pedido.mensaje) {
    lineas.push(`Mensaje: ${pedido.mensaje}`);
  }
  return lineas.join('\n');
}

/**
 * @function enlacePedidoWhatsapp
 * @description Construye la URL wa.me solo a partir de un pedido ya validado.
 */
export function enlacePedidoWhatsapp(
  numeroPedidos: string,
  pedido: PedidoNormalizado,
): string {
  return enlaceWhatsapp(numeroPedidos, construirMensajePedido(pedido));
}

/**
 * @function formularioVacioErrores
 * @description Estado inicial sin mensajes de error visibles.
 */
export function formularioVacioErrores(): ErroresPedido {
  return {
    nombre: null,
    telefono: null,
    direccion: null,
    cantidad: null,
    mensaje: null,
  };
}
