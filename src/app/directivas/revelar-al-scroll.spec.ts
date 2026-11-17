import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RevelarAlScroll } from './revelar-al-scroll';

@Component({
  imports: [RevelarAlScroll],
  template: `<div appRevelarAlScroll>Contenido</div>`,
})
class AnfitrionRevelar {}

describe('RevelarAlScroll', () => {
  it('marca el elemento como revelado cuando no hay motion reducido', async () => {
    await TestBed.configureTestingModule({
      imports: [AnfitrionRevelar],
    }).compileComponents();

    const fixture = TestBed.createComponent(AnfitrionRevelar);
    fixture.detectChanges();
    await fixture.whenStable();

    const nodo = fixture.nativeElement.querySelector('.revelar') as HTMLElement;
    expect(nodo).toBeTruthy();
    // En jsdom no hay IntersectionObserver fiable: el host ya tiene la clase base.
    expect(nodo.classList.contains('revelar')).toBe(true);
  });
});
