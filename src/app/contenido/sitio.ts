import { DatoEtiqueta, ImagenPublica, LineaTelefonica, SeccionNavegacion } from './modelos';

/**
 * @description Nombre legal que figura en las etiquetas.
 */
export const nombreEmpresa = 'Embotelladora Cool Ice SAS';

/**
 * @description Registro INVIMA impreso en las etiquetas de 18,9 L y de 5 L.
 */
export const registroInvima = 'RSA-0024680-2023';

/**
 * @description Municipio y departamento impresos en la etiqueta del botellón.
 */
export const lugar = 'Miranda, Cauca, Colombia';

/**
 * @description Instrucción de conservación del botellón de 18,9 L.
 */
export const conservacionBotellon =
  'Consérvese en un lugar fresco después de abierto y consúmase en un tiempo no mayor a 15 días.';

/**
 * @description Instrucción de conservación de la botella de 5.000 ml.
 */
export const conservacionBotella =
  'Una vez abierto, consumir en el menor tiempo posible. Conservar en un lugar fresco, limpio y protegido de la luz solar directa.';

/**
 * @description Descripción usada en el título social y en el documento.
 */
export const descripcionSitio =
  'Agua potable tratada de Embotelladora Cool Ice SAS. Botellón de 18,9 L, botella de 5 L y contacto por WhatsApp. Miranda, Cauca.';

/**
 * @description Textos que puedes completar sin modificar las plantillas.
 * Una cadena vacía muestra la marca «Pendiente» en la página.
 */
export const camposPorCompletar = {
  /**
   * @description Calle, barrio o referencia. El municipio ya está publicado.
   */
  direccionExacta: '',

  /**
   * @description Horario de atención. No se encontró en el material.
   */
  horario: '',

  /**
   * @description Municipios o zona donde llega el domicilio.
   */
  cobertura: '',

  /**
   * @description Etapas reales del tratamiento. No las completes con un proceso supuesto.
   */
  etapasTratamiento: '',

  /**
   * @description Historia breve de la embotelladora.
   */
  historia: '',

  /**
   * @description Valores redactados por la empresa.
   */
  valores: '',

  /**
   * @description NIT de Embotelladora Cool Ice SAS.
   */
  nit: '',
};

/**
 * @function textoPublicado
 * @description Devuelve el texto cuando ya fue diligenciado.
 * @param valor Texto del archivo de contenido.
 * @returns Texto sin espacios sobrantes, o null si sigue vacío.
 */
export function textoPublicado(valor: string): string | null {
  const limpio = valor.trim();
  return limpio.length > 0 ? limpio : null;
}

/**
 * @function enlaceWhatsapp
 * @description Arma un enlace de WhatsApp con el indicativo de Colombia.
 * @param numero Número local, con o sin espacios.
 * @param mensaje Texto que aparece al abrir el chat.
 * @returns URL de wa.me lista para un enlace.
 */
export function enlaceWhatsapp(numero: string, mensaje: string): string {
  const digitos = numero.replace(/\D/g, '');
  const internacional = digitos.startsWith('57') ? digitos : `57${digitos}`;
  return `https://wa.me/${internacional}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * @description Mensaje que se propone al abrir WhatsApp.
 */
export const mensajeWhatsapp = 'Hola, quiero información sobre el agua Cool Ice.';

/**
 * @description Línea de pedidos impresa en las etiquetas.
 */
export const lineaPedidos: LineaTelefonica = {
  id: 'pedidos',
  etiqueta: 'Pedidos',
  detalle: 'Para pedir botellones y botellas.',
  visible: '321 682 0822',
  telefono: 'tel:+573216820822',
  whatsapp: enlaceWhatsapp('3216820822', mensajeWhatsapp),
  principal: true,
};

/**
 * @description Línea que aparece en la publicidad de dispensadores y domicilio.
 */
export const lineaDispensadores: LineaTelefonica = {
  id: 'dispensadores',
  etiqueta: 'Dispensadores y domicilio',
  detalle: 'Para consultar dispensadores y el domicilio.',
  visible: '313 635 1406',
  telefono: 'tel:+573136351406',
  whatsapp: enlaceWhatsapp('3136351406', mensajeWhatsapp),
  principal: false,
};

/**
 * @description Teléfonos que se muestran en contacto y en el pie.
 */
export const lineasTelefonicas: readonly LineaTelefonica[] = [lineaPedidos, lineaDispensadores];

/**
 * @description Correo impreso en las etiquetas.
 */
export const correo = {
  visible: 'embotelladoracoolicesas@gmail.com',
  href: 'mailto:embotelladoracoolicesas@gmail.com?subject=Pedido%20Cool%20Ice',
};

/**
 * @description Secciones de la página principal, en el orden de la navegación.
 */
export const secciones: readonly SeccionNavegacion[] = [
  { id: 'inicio', etiqueta: 'Inicio' },
  { id: 'productos', etiqueta: 'Productos' },
  { id: 'calidad', etiqueta: 'Calidad' },
  { id: 'nosotros', etiqueta: 'Nosotros' },
  { id: 'contacto', etiqueta: 'Contacto' },
];

/**
 * @description Datos de etiqueta que sí están respaldados por las piezas de la marca.
 */
export const datosDeEtiqueta: readonly DatoEtiqueta[] = [
  {
    titulo: 'Producto',
    texto: 'Agua potable tratada y purificada.',
  },
  {
    titulo: 'Ingrediente declarado',
    texto: 'Agua potable tratada y purificada.',
  },
  {
    titulo: 'Registro INVIMA',
    texto: `En las etiquetas figura ${registroInvima}.`,
  },
  {
    titulo: 'Envasado',
    texto: `${nombreEmpresa}. Industria colombiana.`,
  },
  {
    titulo: 'Domicilio',
    texto: 'Las etiquetas anuncian servicio a domicilio.',
  },
];

/**
 * @description Logotipo horizontal con fondo transparente.
 */
export const logo: ImagenPublica = {
  ruta: 'assets/imagenes/logo-cool-ice.webp',
  ancho: 960,
  alto: 412,
  textoAlternativo: 'Cool Ice, ir al inicio',
};

/**
 * @description Fotografía del botellón sobre el dispensador. Es la imagen principal.
 */
export const imagenHero: ImagenPublica = {
  ruta: 'assets/imagenes/botellon-dispensador.webp',
  ancho: 341,
  alto: 983,
  textoAlternativo: 'Botellón Cool Ice de agua tratada colocado sobre un dispensador blanco.',
};

/**
 * @description Ilustración del reparto. No es una fotografía de la operación.
 */
export const imagenReparto: ImagenPublica = {
  ruta: 'assets/imagenes/reparto.webp',
  ancho: 720,
  alto: 731,
  textoAlternativo: 'Ilustración del oso de Cool Ice llevando un botellón de agua potable tratada.',
};
