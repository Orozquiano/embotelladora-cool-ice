import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

interface Gota {
  x: number;
  y: number;
  largo: number;
  vel: number;
  grosor: number;
  alpha: number;
}

/**
 * @class LluviaFondo
 * @description Lluvia sutil a pantalla completa detrás del contenido.
 */
@Component({
  selector: 'app-lluvia-fondo',
  templateUrl: './lluvia-fondo.html',
  styleUrl: './lluvia-fondo.scss',
  host: {
    class: 'lluvia-fondo',
    'aria-hidden': 'true',
  },
})
export class LluviaFondo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True si no animamos (motion reducido).
   */
  protected readonly usarFallback = signal(false);

  constructor() {
    afterNextRender(() => this.iniciar());
  }

  /**
   * @description Arranca el canvas de lluvia.
   */
  private iniciar(): void {
    const reducir =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducir) {
      this.usarFallback.set(true);
      return;
    }

    const canvas = this.lienzo().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      this.usarFallback.set(true);
      return;
    }

    let gotas: Gota[] = [];
    let marco = 0;
    let visible = true;

    const sembrar = (ancho: number, alto: number): void => {
      const cantidad = Math.min(120, Math.floor((ancho * alto) / 14000));
      gotas = Array.from({ length: cantidad }, () => ({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        largo: 10 + Math.random() * 18,
        vel: 4.5 + Math.random() * 6.5,
        grosor: 0.8 + Math.random() * 1.2,
        alpha: 0.12 + Math.random() * 0.22,
      }));
    };

    const ajustar = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const ancho = window.innerWidth;
      const alto = window.innerHeight;
      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${alto}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sembrar(ancho, alto);
    };
    ajustar();

    const pintar = (): void => {
      marco = requestAnimationFrame(pintar);
      if (!visible) {
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const gota of gotas) {
        gota.y += gota.vel;
        gota.x += 0.35;
        if (gota.y > h + 20) {
          gota.y = -gota.largo;
          gota.x = Math.random() * w;
        }
        if (gota.x > w + 10) {
          gota.x = -10;
        }
        ctx.strokeStyle = `rgba(11, 79, 140, ${gota.alpha})`;
        ctx.lineWidth = gota.grosor;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(gota.x, gota.y);
        ctx.lineTo(gota.x - 1.2, gota.y + gota.largo);
        ctx.stroke();
      }
    };
    marco = requestAnimationFrame(pintar);

    const onResize = (): void => ajustar();
    const onVis = (): void => {
      visible = document.visibilityState === 'visible';
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(marco);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
    });
  }
}
