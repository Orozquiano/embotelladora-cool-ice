/**
 * @interface ImagenPublica
 * @description Imagen optimizada lista para mostrar con ancho y alto reales.
 */
export interface ImagenPublica {
  /**
   * @description Ruta pública, relativa a la base de la aplicación.
   */
  ruta: string;

  /**
   * @description Ancho intrínseco del archivo, en píxeles.
   */
  ancho: number;

  /**
   * @description Alto intrínseco del archivo, en píxeles.
   */
  alto: number;

  /**
   * @description Texto alternativo que describe la imagen.
   */
  textoAlternativo: string;
}

/**
 * @interface Producto
 * @description Presentación comercial que se muestra en la página.
 */
export interface Producto {
  /**
   * @description Identificador estable para la lista.
   */
  id: string;

  /**
   * @description Nombre corto de la presentación.
   */
  nombre: string;

  /**
   * @description Formato o capacidad visible junto al nombre.
   */
  presentacion: string;

  /**
   * @description Descripción breve, basada en el material de la marca.
   */
  descripcion: string;

  /**
   * @description Datos puntuales de esa presentación.
   */
  detalles: readonly string[];

  /**
   * @description Fotografía o etiqueta de la presentación.
   */
  imagen: ImagenPublica;

  /**
   * @description Orientación de la imagen para acomodar el texto.
   */
  orientacion: 'vertical' | 'horizontal';
}

/**
 * @interface LineaTelefonica
 * @description Teléfono comercial con acceso a llamada y WhatsApp.
 */
export interface LineaTelefonica {
  /**
   * @description Identificador estable de la línea.
   */
  id: string;

  /**
   * @description Uso de la línea, por ejemplo pedidos.
   */
  etiqueta: string;

  /**
   * @description Aclara de dónde sale el número.
   */
  detalle: string;

  /**
   * @description Número tal como se muestra en pantalla.
   */
  visible: string;

  /**
   * @description Enlace tel con indicativo de Colombia.
   */
  telefono: string;

  /**
   * @description Enlace de WhatsApp con mensaje inicial.
   */
  whatsapp: string;

  /**
   * @description Indica si esta línea es el canal principal de pedidos.
   */
  principal: boolean;
}

/**
 * @interface SeccionNavegacion
 * @description Destino interno de la barra de navegación.
 */
export interface SeccionNavegacion {
  /**
   * @description Identificador de la sección en la página.
   */
  id: string;

  /**
   * @description Texto del enlace.
   */
  etiqueta: string;
}

/**
 * @interface DatoEtiqueta
 * @description Dato declarado en las etiquetas de Cool Ice.
 */
export interface DatoEtiqueta {
  /**
   * @description Nombre del dato.
   */
  titulo: string;

  /**
   * @description Texto que se puede afirmar con el material disponible.
   */
  texto: string;
}

/**
 * @interface Beneficio
 * @description Mensaje breve de valor, alineado con la propuesta visual.
 */
export interface Beneficio {
  /**
   * @description Identificador estable.
   */
  id: string;

  /**
   * @description Título corto del beneficio.
   */
  titulo: string;

  /**
   * @description Texto respaldado por el material disponible.
   */
  texto: string;
}
