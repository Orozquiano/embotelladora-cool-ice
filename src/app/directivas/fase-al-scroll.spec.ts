import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FaseAlScroll } from './fase-al-scroll';

@Component({
  imports: [FaseAlScroll],
  template: `<div [appFaseAlScroll]="0">Fase</div>`,
})
class AnfitrionFase {}

describe('FaseAlScroll', () => {
  it('aplica la clase base de fase', async () => {
    await TestBed.configureTestingModule({
      imports: [AnfitrionFase],
    }).compileComponents();

    const fixture = TestBed.createComponent(AnfitrionFase);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.fase-scroll')).toBeTruthy();
  });
});
