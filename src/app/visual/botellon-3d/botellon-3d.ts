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
 * @description Porrón Cool Ice 3D interactivo con agua que se mueve al girarlo.
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
    let RoomEnvironment: typeof import('three/examples/jsm/environments/RoomEnvironment.js').RoomEnvironment;
    try {
      THREE = await import('three');
      ({ RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js'));
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const escena = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    escena.environment = entorno;

    const camara = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camara.position.set(0.2, 0.25, 4.6);

    const textura = await new Promise<InstanceType<typeof THREE.Texture> | null>((resolve) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        'assets/imagenes/etiqueta-producto-18-9l.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          resolve(tex);
        },
        undefined,
        () => resolve(null),
      );
    });

    const { grupo, superficieAgua, materialSuperficie, burbujas, liberar } = crearBotellon(
      THREE,
      textura,
    );
    grupo.rotation.y = -0.55;
    escena.add(grupo);

    const luzClave = new THREE.DirectionalLight(0xffffff, 1.7);
    luzClave.position.set(2.8, 4.2, 3.5);
    escena.add(luzClave);
    const luzRelleno = new THREE.DirectionalLight(0xb7dcff, 0.9);
    luzRelleno.position.set(-3, 1.5, 2);
    escena.add(luzRelleno);
    escena.add(new THREE.AmbientLight(0xeaf6ff, 0.55));

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
    let slosh = 0;
    const autoGirar = !reducirMotion;
    let tiempo = 0;

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
      velY = dx * 0.009;
      velX = dy * 0.005;
      grupo.rotation.y += velY;
      grupo.rotation.x = THREE.MathUtils.clamp(grupo.rotation.x + velX, -0.45, 0.45);
      slosh = Math.min(1.4, slosh + Math.hypot(dx, dy) * 0.012);
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
        grupo.rotation.y -= 0.14;
        slosh = Math.min(1.4, slosh + 0.25);
        evento.preventDefault();
      } else if (evento.key === 'ArrowRight') {
        grupo.rotation.y += 0.14;
        slosh = Math.min(1.4, slosh + 0.25);
        evento.preventDefault();
      } else if (evento.key === 'ArrowUp') {
        grupo.rotation.x = THREE.MathUtils.clamp(grupo.rotation.x - 0.08, -0.45, 0.45);
        slosh = Math.min(1.4, slosh + 0.2);
        evento.preventDefault();
      } else if (evento.key === 'ArrowDown') {
        grupo.rotation.x = THREE.MathUtils.clamp(grupo.rotation.x + 0.08, -0.45, 0.45);
        slosh = Math.min(1.4, slosh + 0.2);
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
      tiempo += 0.016;
      if (!this.arrastrando() && autoGirar) {
        grupo.rotation.y += 0.0035 + velY;
        velY *= 0.94;
        velX *= 0.9;
        grupo.rotation.x += velX;
        grupo.rotation.x *= 0.97;
      }

      slosh *= 0.965;
      materialSuperficie.uniforms['uTime'].value = tiempo;
      materialSuperficie.uniforms['uSlosh'].value = slosh;
      // La superficie tiende a quedarse “nivelada” frente a la inclinación del envase.
      materialSuperficie.uniforms['uTiltX'].value = -grupo.rotation.z * 0.8 + Math.sin(tiempo) * 0.02;
      materialSuperficie.uniforms['uTiltZ'].value = grupo.rotation.x * 0.9;
      superficieAgua.rotation.z = Math.sin(tiempo * 0.7) * 0.02 * (0.25 + slosh);

      for (const hijo of burbujas.children) {
        const b = hijo as InstanceType<typeof THREE.Mesh>;
        const vel = Number(b.userData['vel'] ?? 0.15);
        const fase = Number(b.userData['fase'] ?? 0);
        b.position.y += vel * 0.016 * (1 + slosh * 0.8);
        b.position.x += Math.sin(tiempo * 2 + fase) * 0.0015;
        if (b.position.y > 0.88) {
          b.position.y = -1.15;
          b.position.x = (Math.random() - 0.5) * 0.9;
          b.position.z = (Math.random() - 0.5) * 0.9;
        }
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
      entorno.dispose();
      pmrem.dispose();
      renderer.dispose();
    });
  }
}
