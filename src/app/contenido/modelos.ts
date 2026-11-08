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
 * @interface Beneficio
 * @description Mensaje breve de valor, alineado con la propuesta visual.
 */
export interface Beneficio {
  /**
   * @description Identificador estable.
   */
  id: string;

  /**
   * @description Marca corta para el ícono del beneficio.
   */
  marca: string;

  /**
   * @description Título corto del beneficio.
   */
  titulo: string;

  /**
   * @description Texto respaldado por el material disponible.
   */
  texto: string;
}

/**
 * @interface EtapaProceso
 * @description Etapa numerada del proceso de tratamiento.
 */
export interface EtapaProceso {
  /**
   * @description Número visible de la etapa.
   */
  numero: string;

  /**
   * @description Nombre de la etapa.
   */
  titulo: string;

  /**
   * @description Descripción breve de la etapa.
   */
  texto: string;
}

/**
 * @interface PilarConfianza
 * @description Argumento de confianza mostrado en la sección correspondiente.
 */
export interface PilarConfianza {
  /**
   * @description Identificador estable.
   */
  id: string;

  /**
   * @description Marca corta para el ícono.
   */
  marca: string;

  /**
   * @description Título del pilar.
   */
  titulo: string;

  /**
   * @description Texto de apoyo.
   */
  texto: string;
}

/**
 * @interface DatoServicio
 * @description Celda del panel de servicio a domicilio.
 */
export interface DatoServicio {
  /**
   * @description Título de la celda.
   */
  titulo: string;

  /**
   * @description Detalle visible bajo el título.
   */
  detalle: string;
}

/**
 * @interface DatoOrigen
 * @description Fila de cobertura u origen.
 */
export interface DatoOrigen {
  /**
   * @description Marca corta para el ícono.
   */
  marca: string;

  /**
   * @description Título de la fila.
   */
  titulo: string;

  /**
   * @description Detalle de la fila.
   */
  detalle: string;
}
