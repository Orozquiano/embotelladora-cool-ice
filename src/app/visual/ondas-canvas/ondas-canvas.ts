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
 * @class OndasCanvas
 * @description Superficie de agua con ondas suaves en Canvas 2D (sin Three.js).
 */
@Component({
  selector: 'app-ondas-canvas',
  templateUrl: './ondas-canvas.html',
  styleUrl: './ondas-canvas.scss',
  host: {
    class: 'ondas-canvas',
    'aria-hidden': 'true',
  },
})
export class OndasCanvas {
  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True cuando se usa el degradado estático.
   */
  protected readonly usarFallback = signal(false);

  constructor() {
    afterNextRender(() => {
      this.iniciar();
    });
  }

  /**
   * @description Inicia el bucle de ondas o el fallback.
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
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      this.usarFallback.set(true);
      return;
    }

    let ancho = 0;
    let alto = 0;
    let dpr = 1;
    let tiempo = 0;
    let animando = false;
    let visible = true;
    let marco = 0;
    const estrecho =
      window.matchMedia('(max-width: 48rem)').matches ||
      window.matchMedia('(pointer: coarse)').matches;

    const redimensionar = (): void => {
      dpr = Math.min(window.devicePixelRatio || 1, estrecho ? 1.2 : 1.5);
      ancho = Math.max(1, canvas.clientWidth);
      alto = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const dibujarOnda = (
      fase: number,
      amplitud: number,
      periodo: number,
      color: string,
      base: number,
    ): void => {
      ctx.beginPath();
      ctx.moveTo(0, alto);
      for (let x = 0; x <= ancho; x += 4) {
        const y =
          base +
          Math.sin(x / periodo + fase) * amplitud +
          Math.sin(x / (periodo * 1.7) + fase * 1.3) * (amplitud * 0.45);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(ancho, alto);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const dibujar = (ahora: number): void => {
      if (!animando || !visible) {
        return;
      }
      tiempo = ahora * 0.001;
      ctx.clearRect(0, 0, ancho, alto);

      dibujarOnda(tiempo * 0.7, alto * 0.06, 90, 'rgba(11, 79, 140, 0.22)', alto * 0.42);
      dibujarOnda(tiempo * 1.05 + 1.2, alto * 0.05, 70, 'rgba(30, 144, 255, 0.28)', alto * 0.5);
      dibujarOnda(tiempo * 1.35 + 2.1, alto * 0.035, 55, 'rgba(126, 200, 240, 0.4)', alto * 0.58);

      // Reflejo suave superior
      const brillo = ctx.createLinearGradient(0, 0, 0, alto * 0.55);
      brillo.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      brillo.addColorStop(0.55, 'rgba(255, 255, 255, 0.05)');
      brillo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = brillo;
      ctx.fillRect(0, 0, ancho, alto * 0.55);

      marco = requestAnimationFrame(dibujar);
    };

    const arrancar = (): void => {
      if (animando || !visible) {
        return;
      }
      animando = true;
      marco = requestAnimationFrame(dibujar);
    };

    const detener = (): void => {
      animando = false;
      cancelAnimationFrame(marco);
    };

    redimensionar();
    const alRedimensionar = (): void => redimensionar();
    window.addEventListener('resize', alRedimensionar, { passive: true });

    const observador = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada?.isIntersecting ?? false;
        if (visible) {
          arrancar();
        } else {
          detener();
        }
      },
      { threshold: 0.05 },
    );
    observador.observe(canvas);
    arrancar();

    this.destroyRef.onDestroy(() => {
      detener();
      observador.disconnect();
      window.removeEventListener('resize', alRedimensionar);
    });
  }
}
