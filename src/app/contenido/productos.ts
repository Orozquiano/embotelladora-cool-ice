import { Producto } from './modelos';
import { conservacionBotella, conservacionBotellon, nombreEmpresa } from './sitio';

/**
 * @description Presentaciones que se pueden mostrar con el material actual.
 */
export const productos: readonly Producto[] = [
  {
    id: 'botellon',
    nombre: 'Botellón',
    presentacion: '18,9 L (3 gal)',
    descripcion:
      'Agua potable tratada para dispensador. En la etiqueta, el ingrediente declarado es agua potable tratada y purificada.',
    detalles: [
      'Contenido de 18,9 litros, equivalente a 3 galones.',
      conservacionBotellon,
      `Envasado por ${nombreEmpresa}.`,
    ],
    imagen: {
      ruta: 'assets/imagenes/botellon-dispensador.webp',
      ancho: 341,
      alto: 983,
      textoAlternativo: 'Botellón de 18,9 litros de Cool Ice sobre el dispensador.',
    },
    orientacion: 'vertical',
  },
  {
    id: 'botella',
    nombre: 'Botella',
    presentacion: '5.000 ml',
    descripcion:
      'La etiqueta de esta presentación la identifica como agua potable tratada purificada y también como agua natural.',
    detalles: [
      'Contenido neto de 5.000 ml.',
      conservacionBotella,
      `Envasada por ${nombreEmpresa}.`,
    ],
    imagen: {
      ruta: 'assets/imagenes/presentacion-5l.webp',
      ancho: 1200,
      alto: 901,
      textoAlternativo: 'Etiqueta de la botella Cool Ice de 5.000 ml, con el oso de la marca y el contenido neto.',
    },
    orientacion: 'horizontal',
  },
  {
    id: 'dispensador',
    nombre: 'Dispensador',
    presentacion: 'Agua fría y caliente',
    descripcion:
      'Equipo de piso con llaves de agua caliente y fría, bandeja y gabinete. En la publicidad de botellones se indica que hay dispensadores disponibles sin costo adicional; las condiciones se confirman al pedir el servicio.',
    detalles: [
      'Gabinete con repisa interna.',
      'Según el empaque del equipo, el agua caliente va de 85 °C a 95 °C y la fría de 5 °C a 10 °C.',
    ],
    imagen: {
      ruta: 'assets/imagenes/dispensador-gabinete.webp',
      ancho: 349,
      alto: 982,
      textoAlternativo: 'Dispensador con el gabinete abierto y las llaves de agua caliente y fría.',
    },
    orientacion: 'vertical',
  },
];
