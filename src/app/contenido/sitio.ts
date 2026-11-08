import {
  Beneficio,
  DatoOrigen,
  DatoServicio,
  EtapaProceso,
  ImagenPublica,
  LineaTelefonica,
  PilarConfianza,
  SeccionNavegacion,
} from './modelos';

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
 * @description Descripción usada en el título social y en el documento.
 */
export const descripcionSitio =
  'Agua potable tratada de Embotelladora Cool Ice SAS. Bidón familiar de 18,9 L y contacto por WhatsApp. Miranda, Cauca.';

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
  href: 'mailto:embotelladoracoolicesas@gmail.com?subject=Pedido%20Cool%20Ice&body=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20Cool%20Ice.',
};

/**
 * @description Secciones de la página principal, en el orden de la navegación del Figma.
 */
export const secciones: readonly SeccionNavegacion[] = [
  { id: 'beneficios', etiqueta: 'Beneficios' },
  { id: 'producto', etiqueta: 'Producto' },
  { id: 'proceso', etiqueta: 'Proceso' },
  { id: 'domicilio', etiqueta: 'Domicilio' },
  { id: 'confianza', etiqueta: 'Confianza' },
  { id: 'contacto', etiqueta: 'Contacto' },
];

/**
 * @description Tres mensajes de valor de la propuesta visual.
 */
export const beneficios: readonly Beneficio[] = [
  {
    id: 'pureza',
    marca: 'Agua',
    titulo: 'Máxima pureza',
    texto:
      'Agua potable tratada y purificada mediante un proceso estricto que garantiza calidad constante en cada bidón.',
  },
  {
    id: 'sabor',
    marca: 'Fresco',
    titulo: 'Sabor fresco',
    texto:
      'Un perfil limpio y refrescante, ideal para beber, cocinar y acompañar el día a día de tu hogar o negocio.',
  },
  {
    id: 'domicilio',
    marca: 'Envío',
    titulo: 'Llega a tu puerta',
    texto:
      'Servicio a domicilio ágil. Pides por WhatsApp y te llevamos el bidón de 18,9 L donde lo necesites.',
  },
];

/**
 * @description Detalles del producto estrella de 18,9 L.
 */
export const detallesProducto: readonly string[] = [
  'Capacidad 18,9 L (5 Gal) — rinde para toda la familia',
  'Agua potable tratada y purificada',
  `Registro sanitario INVIMA ${registroInvima}`,
  'Conservar en lugar fresco; consumir preferiblemente en 15 días tras abrir',
  'Envase reciclable — cuida tu ciudad',
];

/**
 * @description Etapas del proceso de purificación según la propuesta visual.
 */
export const etapasProceso: readonly EtapaProceso[] = [
  {
    numero: '1',
    titulo: 'Captación',
    texto: 'Seleccionamos agua de fuente apta y controlamos su calidad desde el origen.',
  },
  {
    numero: '2',
    titulo: 'Filtración',
    texto: 'Retenemos partículas e impurezas con filtración en múltiples etapas.',
  },
  {
    numero: '3',
    titulo: 'Tratamiento',
    texto: 'Aplicamos procesos de potabilización y purificación bajo parámetros estrictos.',
  },
  {
    numero: '4',
    titulo: 'Embotellado',
    texto: 'Envasamos en condiciones higiénicas y sellamos cada bidón listo para entregar.',
  },
];

/**
 * @description Celdas del panel azul de servicio a domicilio.
 */
export const datosServicio: readonly DatoServicio[] = [
  { titulo: 'WhatsApp', detalle: lineaPedidos.visible },
  { titulo: 'Respuesta rápida', detalle: 'Atención directa' },
  { titulo: 'Bidón 18,9 L', detalle: 'Listo para usar' },
  { titulo: 'Reposición', detalle: 'Agenda tu próximo pedido' },
];

/**
 * @description Filas de cobertura y origen.
 */
export const datosOrigen: readonly DatoOrigen[] = [
  { marca: 'Sitio', titulo: 'Miranda, Cauca', detalle: 'Planta embotelladora' },
  { marca: 'Origen', titulo: 'Industria colombiana', detalle: 'Hecho en Colombia' },
  {
    marca: 'Ruta',
    titulo: 'Entrega local',
    detalle: 'Consulta cobertura por WhatsApp',
  },
];

/**
 * @description Pilares de la sección de confianza.
 */
export const pilaresConfianza: readonly PilarConfianza[] = [
  {
    id: 'invima',
    marca: 'RSA',
    titulo: 'Registro INVIMA',
    texto: `${registroInvima} — agua potable tratada bajo normativa sanitaria.`,
  },
  {
    id: 'colombia',
    marca: 'CO',
    titulo: 'Industria colombiana',
    texto: 'Producido en Miranda, Cauca, con orgullo local.',
  },
  {
    id: 'familia',
    marca: 'Hogar',
    titulo: 'Para tu familia',
    texto: 'Pensado para el consumo diario seguro en hogares y negocios.',
  },
  {
    id: 'ambiente',
    marca: 'Eco',
    titulo: 'Cuidado ambiental',
    texto: 'Envase reciclable. Mantén tu ciudad limpia.',
  },
];

/**
 * @description Logotipo horizontal usado en la barra.
 */
export const logo: ImagenPublica = {
  ruta: 'assets/imagenes/logo-cool-ice-figma.jpg',
  ancho: 440,
  alto: 254,
  textoAlternativo: 'Cool Ice',
};

/**
 * @description Marca del hero según el diseño de Figma.
 */
export const imagenHero: ImagenPublica = {
  ruta: 'assets/imagenes/marca-cool-ice-hero.jpg',
  ancho: 440,
  alto: 440,
  textoAlternativo: 'Logo Cool Ice con el osito polar y el agua.',
};

/**
 * @description Etiqueta del producto estrella de 18,9 L.
 */
export const imagenProducto: ImagenPublica = {
  ruta: 'assets/imagenes/etiqueta-producto-18-9l.jpg',
  ancho: 440,
  alto: 147,
  textoAlternativo: 'Etiqueta del bidón Cool Ice de 18,9 litros.',
};

/**
 * @description Estadísticas del hero.
 */
export const estadisticasHero = [
  { valor: '18,9 L', detalle: 'Bidón familiar (5 Gal)' },
  { valor: 'INVIMA', detalle: registroInvima },
  { valor: '24/7', detalle: 'Pedidos por WhatsApp' },
] as const;
