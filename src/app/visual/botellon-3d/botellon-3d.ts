import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { crearBotellon } from './crear-botellon';

/**
 * @class Botellon3d
 * @description Porrón 3D interactivo: el usuario lo gira con puntero, táctil o teclado.
 */
@Component({
  selector: 'app-botellon-3d',
  templateUrl: './botellon-3d.html',
  styleUrl: './botellon-3d.scss',
  host: {
    class: 'botellon-3d',
  },
})
export class Botellon3d {
  /**
   * @description Etiqueta accesible del modelo.
   */
  readonly etiqueta = input('Porrón Cool Ice de 18,9 litros');

  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True si mostramos la ilustración estática.
   */
  protected readonly usarFallback = signal(false);

  /**
   * @description Indica si el usuario está arrastrando.
   */
  protected readonly arrastrando = signal(false);

  constructor() {
    afterNextRender(() => {
      void this.iniciar();
    });
  }

  /**
   * @description Arranca la escena WebGL del botellón.
   */
  private async iniciar(): Promise<void> {
    const reducirMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let THREE: typeof import('three');
    try {
      THREE = await import('three');
    } catch {
      this.usarFallback.set(true);
      return;
    }

    const canvas = this.lienzo().nativeElement;
    let renderer: InstanceType<typeof THREE.WebGLRenderer>;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      this.usarFallback.set(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camara.position.set(0.15, 0.35, 4.2);

    const { grupo, liberar } = crearBotellon(THREE);
    grupo.rotation.y = -0.45;
    escena.add(grupo);

    const luzClave = new THREE.DirectionalLight(0xffffff, 1.55);
    luzClave.position.set(2.4, 3.2, 4);
    escena.add(luzClave);
    const luzRelleno = new THREE.DirectionalLight(0xb7dcff, 0.85);
    luzRelleno.position.set(-2.5, 1.2, 1.5);
    escena.add(luzRelleno);
    escena.add(new THREE.AmbientLight(0xe8f4fc, 0.7));

    const ajustar = (): void => {
      const host = canvas.parentElement;
      const ancho = host?.clientWidth || 320;
      const alto = host?.clientHeight || 360;
      renderer.setSize(ancho, alto, false);
      camara.aspect = ancho / Math.max(alto, 1);
      camara.updateProjectionMatrix();
    };
    ajustar();

    let marco = 0;
    let visible = true;
    let pointerId: number | null = null;
    let ultimoX = 0;
    let ultimoY = 0;
    let velY = 0;
    let velX = 0;
    const autoGirar = !reducirMotion;

    const onPointerDown = (evento: PointerEvent): void => {
      pointerId = evento.pointerId;
      canvas.setPointerCapture(pointerId);
      this.arrastrando.set(true);
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      velY = 0;
      velX = 0;
    };

    const onPointerMove = (evento: PointerEvent): void => {
      if (pointerId !== evento.pointerId) {
        return;
      }
      const dx = evento.clientX - ultimoX;
      const dy = evento.clientY - ultimoY;
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      velY = dx * 0.008;
      velX = dy * 0.005;
      grupo.rotation.y += velY;
      grupo.rotation.x = THREE.MathUtils.clamp(grupo.rotation.x + velX, -0.55, 0.55);
    };

    const onPointerUp = (evento: PointerEvent): void => {
      if (pointerId !== evento.pointerId) {
        return;
      }
      canvas.releasePointerCapture(pointerId);
      pointerId = null;
      this.arrastrando.set(false);
    };

    const onTecla = (evento: KeyboardEvent): void => {
      if (evento.key === 'ArrowLeft') {
        grupo.rotation.y -= 0.12;
        evento.preventDefault();
      } else if (evento.key === 'ArrowRight') {
        grupo.rotation.y += 0.12;
        evento.preventDefault();
      } else if (evento.key === 'ArrowUp') {
        grupo.rotation.x = THREE.MathUtils.clamp(grupo.rotation.x - 0.08, -0.55, 0.55);
        evento.preventDefault();
      } else if (evento.key === 'ArrowDown') {
        grupo.rotation.x = THREE.MathUtils.clamp(grupo.rotation.x + 0.08, -0.55, 0.55);
        evento.preventDefault();
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('keydown', onTecla);

    const animar = (): void => {
      marco = requestAnimationFrame(animar);
      if (!visible) {
        return;
      }
      if (!this.arrastrando() && autoGirar) {
        grupo.rotation.y += 0.004 + velY;
        velY *= 0.95;
        velX *= 0.9;
        grupo.rotation.x += velX;
        grupo.rotation.x *= 0.98;
      }
      renderer.render(escena, camara);
    };
    marco = requestAnimationFrame(animar);

    const onResize = (): void => ajustar();
    window.addEventListener('resize', onResize);

    const observador = new IntersectionObserver(
      (entradas) => {
        visible = entradas.some((entrada) => entrada.isIntersecting);
      },
      { threshold: 0.08 },
    );
    observador.observe(canvas);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(marco);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('keydown', onTecla);
      observador.disconnect();
      liberar();
      renderer.dispose();
    });
  }
}
