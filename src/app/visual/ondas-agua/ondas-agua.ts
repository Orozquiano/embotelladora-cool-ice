import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

/**
 * @class OndasAgua
 * @description Franja de ondas/caústicas animadas para secciones (sin WebGL pesado).
 */
@Component({
  selector: 'app-ondas-agua',
  templateUrl: './ondas-agua.html',
  styleUrl: './ondas-agua.scss',
  host: {
    class: 'ondas-agua',
    'aria-hidden': 'true',
  },
})
export class OndasAgua {
  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True si usamos el CSS estático.
   */
  protected readonly usarFallback = signal(false);

  constructor() {
    afterNextRender(() => {
      this.iniciar();
    });
  }

  /**
   * @description Dibuja ondas suaves en canvas 2D.
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

    let marco = 0;
    let visible = true;
    let t = 0;

    const ajustar = (): void => {
      const host = canvas.parentElement;
      const ancho = host?.clientWidth || window.innerWidth;
      const alto = host?.clientHeight || 120;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      canvas.style.width = `${ancho}px`;
      canvas.style.height = `${alto}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();

    const pintar = (): void => {
      marco = requestAnimationFrame(pintar);
      if (!visible) {
        return;
      }
      t += 0.016;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(232, 244, 252, 0)');
      grad.addColorStop(0.45, 'rgba(126, 200, 240, 0.18)');
      grad.addColorStop(1, 'rgba(11, 79, 140, 0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let capa = 0; capa < 3; capa += 1) {
        ctx.beginPath();
        const amp = 6 + capa * 4;
        const yBase = h * (0.35 + capa * 0.18);
        const vel = 0.9 + capa * 0.35;
        for (let x = 0; x <= w; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.018 + t * vel + capa) * amp +
            Math.sin(x * 0.04 - t * (vel + 0.4)) * (amp * 0.35);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = `rgba(30, 144, 255, ${0.06 + capa * 0.04})`;
        ctx.fill();
      }

      // Destellos tipo caústica.
      for (let i = 0; i < 5; i += 1) {
        const x = ((t * 40 + i * 97) % (w + 80)) - 40;
        const y = h * 0.25 + Math.sin(t + i) * 12;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 28);
        g.addColorStop(0, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(x, y, 26, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    marco = requestAnimationFrame(pintar);

    const onResize = (): void => ajustar();
    window.addEventListener('resize', onResize);
    const observador = new IntersectionObserver(
      (entradas) => {
        visible = entradas.some((e) => e.isIntersecting);
      },
      { threshold: 0.05 },
    );
    observador.observe(canvas);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(marco);
      window.removeEventListener('resize', onResize);
      observador.disconnect();
    });
  }
}
