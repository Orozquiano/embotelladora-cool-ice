import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ImagenEsqueleto } from './imagen-esqueleto';

/**
 * @class AnfitrionImagenEsqueleto
 * @description Componente mínimo para probar la directiva de esqueleto.
 */
@Component({
  imports: [ImagenEsqueleto],
  template: '<img appImagenEsqueleto src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="" width="1" height="1" />',
})
class AnfitrionImagenEsqueleto {}

describe('ImagenEsqueleto', () => {
  it('marca la imagen como lista al disparar load', async () => {
    const fixture = TestBed.createComponent(AnfitrionImagenEsqueleto);
    await fixture.whenStable();
    const imagen = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(imagen.classList.contains('imagen-esqueleto')).toBe(true);

    imagen.dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(imagen.classList.contains('imagen-esqueleto--lista')).toBe(true);
  });
});
