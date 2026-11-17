import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

type Gota = {
  x: number;
  y: number;
  largo: number;
  velocidad: number;
  grosor: number;
  alfa: number;
};

/**
 * @class LluviaCanvas
 * @description Lluvia suave con Canvas 2D (sin WebGL/Three.js).
 * Se pausa fuera del viewport y respeta prefers-reduced-motion.
 */
@Component({
  selector: 'app-lluvia-canvas',
  templateUrl: './lluvia-canvas.html',
  styleUrl: './lluvia-canvas.scss',
  host: {
    class: 'lluvia-canvas',
    'aria-hidden': 'true',
  },
})
export class LluviaCanvas {
  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True cuando solo se muestra el fondo estático.
   */
  protected readonly usarFallback = signal(false);

  constructor() {
    afterNextRender(() => {
      this.iniciar();
    });
  }

  /**
   * @description Arranca o cae a fallback según capacidad y preferencias.
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

    const estrecho =
      window.matchMedia('(max-width: 48rem)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const cantidad = estrecho ? 42 : 72;
    let ancho = 0;
    let alto = 0;
    let dpr = 1;
    let animando = false;
    let visible = true;
    let marco = 0;
    const gotas: Gota[] = [];

    const recrearGotas = (): void => {
      gotas.length = 0;
      for (let i = 0; i < cantidad; i++) {
        gotas.push(this.nuevaGota(ancho, alto, true));
      }
    };

    const redimensionar = (): void => {
      dpr = Math.min(window.devicePixelRatio || 1, estrecho ? 1.25 : 1.5);
      ancho = Math.max(1, canvas.clientWidth);
      alto = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(ancho * dpr);
      canvas.height = Math.floor(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      recrearGotas();
    };

    const dibujar = (): void => {
      if (!animando || !visible) {
        return;
      }
      ctx.clearRect(0, 0, ancho, alto);
      for (const gota of gotas) {
        gota.y += gota.velocidad;
        gota.x += gota.velocidad * 0.12;
        if (gota.y > alto + 12 || gota.x > ancho + 8) {
          Object.assign(gota, this.nuevaGota(ancho, alto, false));
        }
        ctx.strokeStyle = `rgba(126, 200, 240, ${gota.alfa})`;
        ctx.lineWidth = gota.grosor;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(gota.x, gota.y);
        ctx.lineTo(gota.x - gota.largo * 0.18, gota.y + gota.largo);
        ctx.stroke();
      }
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

    const alRedimensionar = (): void => {
      redimensionar();
    };
    window.addEventListener('resize', alRedimensionar, { passive: true });

    const observador = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada?.isIntersecting ?? false;
        if (visible) {
          arrancar();
        } else {
          detener();
          ctx.clearRect(0, 0, ancho, alto);
        }
      },
      { threshold: 0.01 },
    );
    observador.observe(canvas);
    arrancar();

    this.destroyRef.onDestroy(() => {
      detener();
      observador.disconnect();
      window.removeEventListener('resize', alRedimensionar);
    });
  }

  /**
   * @description Crea una gota con valores aleatorios suaves.
   */
  private nuevaGota(ancho: number, alto: number, dispersar: boolean): Gota {
    return {
      x: Math.random() * (ancho + 40) - 20,
      y: dispersar ? Math.random() * alto : -10 - Math.random() * 40,
      largo: 8 + Math.random() * 14,
      velocidad: 2.2 + Math.random() * 3.4,
      grosor: 0.7 + Math.random() * 1.1,
      alfa: 0.18 + Math.random() * 0.28,
    };
  }
}
