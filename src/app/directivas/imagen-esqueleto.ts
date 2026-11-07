import { afterNextRender, Directive, ElementRef, inject, signal } from '@angular/core';

/**
 * @class ImagenEsqueleto
 * @description Marca una imagen como lista al cargar para retirar el esqueleto visual.
 */
@Directive({
  selector: 'img[appImagenEsqueleto]',
  host: {
    class: 'imagen-esqueleto',
    '[class.imagen-esqueleto--lista]': 'lista()',
    '(load)': 'marcarLista()',
    '(error)': 'marcarLista()',
  },
})
export class ImagenEsqueleto {
  /**
   * @description Elemento de imagen al que se aplica el esqueleto.
   */
  private readonly elemento = inject(ElementRef<HTMLImageElement>);

  /**
   * @description Indica si la imagen ya terminó de cargar o falló.
   */
  protected readonly lista = signal(false);

  constructor() {
    afterNextRender(() => {
      const imagen = this.elemento.nativeElement;
      if (imagen.complete && imagen.naturalWidth > 0) {
        this.marcarLista();
      }
    });
  }

  /**
   * @function marcarLista
   * @description Indica que la imagen ya está disponible para mostrarla.
   */
  protected marcarLista(): void {
    this.lista.set(true);
  }
}
