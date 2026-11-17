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
 * @class CascadaAgua
 * @description Cascada / chorro de agua en WebGL para acompañar el proceso.
 */
@Component({
  selector: 'app-cascada-agua',
  templateUrl: './cascada-agua.html',
  styleUrl: './cascada-agua.scss',
  host: {
    class: 'cascada-agua',
    'aria-hidden': 'true',
  },
})
export class CascadaAgua {
  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True si usamos degradado estático.
   */
  protected readonly usarFallback = signal(false);

  constructor() {
    afterNextRender(() => {
      void this.iniciar();
    });
  }

  /**
   * @description Monta un plano con shader de cascada (Three.js diferido).
   */
  private async iniciar(): Promise<void> {
    const reducir =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducir) {
      this.usarFallback.set(true);
      return;
    }

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);

    const escena = new THREE.Scene();
    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camara.position.z = 1;

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#d7effc') },
        uColorB: { value: new THREE.Color('#1e90ff') },
        uColorC: { value: new THREE.Color('#0b4f8c') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;
          float flujo = uv.y * 14.0 - uTime * 3.2;
          float vena1 = sin(uv.x * 28.0 + flujo) * 0.5 + 0.5;
          float vena2 = sin(uv.x * 52.0 - flujo * 1.4) * 0.5 + 0.5;
          float espuma = smoothstep(0.75, 1.0, vena1 * vena2);
          float cuerpo = smoothstep(0.05, 0.35, uv.x) * smoothstep(0.95, 0.65, uv.x);
          float caida = fract(uv.y * 6.0 - uTime * 1.8);
          float brillo = pow(1.0 - abs(caida - 0.5) * 2.0, 3.0);
          float ruido = hash(vec2(uv.x * 40.0, floor(flujo)));
          vec3 color = mix(uColorC, uColorB, vena1);
          color = mix(color, uColorA, espuma * 0.65 + brillo * 0.35);
          float alpha = (0.28 + vena2 * 0.22 + espuma * 0.25) * cuerpo;
          alpha *= 0.75 + ruido * 0.25;
          alpha *= smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.88, uv.y);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const malla = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    escena.add(malla);

    const ajustar = (): void => {
      const host = canvas.parentElement;
      const ancho = host?.clientWidth || 280;
      const alto = host?.clientHeight || 420;
      renderer.setSize(ancho, alto, false);
    };
    ajustar();

    let marco = 0;
    let visible = true;
    const animar = (): void => {
      marco = requestAnimationFrame(animar);
      if (!visible) {
        return;
      }
      material.uniforms['uTime'].value += 0.016;
      renderer.render(escena, camara);
    };
    marco = requestAnimationFrame(animar);

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
      malla.geometry.dispose();
      material.dispose();
      renderer.dispose();
    });
  }
}
