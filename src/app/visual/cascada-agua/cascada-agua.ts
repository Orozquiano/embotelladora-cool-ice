import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

/**
 * @class CascadaAgua
 * @description Cascada con partículas + superficie de agua (inspirada en Weatherglass).
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
  /**
   * @description Fase activa del proceso (0-based).
   */
  readonly fase = input(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True si usamos degradado estático.
   */
  protected readonly usarFallback = signal(false);

  private readonly faseInterna = signal(0);

  constructor() {
    effect(() => {
      this.faseInterna.set(this.fase());
    });

    afterNextRender(() => {
      void this.iniciar();
    });
  }

  /**
   * @description Monta escena Three.js: plano de agua + lluvia/cascada de partículas.
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    camara.position.set(0, 0.15, 3.4);

    // Superficie de agua (estanque) con ondulación.
    const aguaGeo = new THREE.PlaneGeometry(4.2, 1.35, 48, 24);
    const aguaMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uFase: { value: 0 },
        uColorA: { value: new THREE.Color('#9fd4f5') },
        uColorB: { value: new THREE.Color('#0b6fbf') },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin(pos.x * 4.5 + uTime * 1.6) * 0.04
            + cos(pos.y * 5.5 - uTime * 1.2) * 0.03;
          pos.z += wave;
          vWave = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        uniform float uFase;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          float caustica = 0.5 + 0.5 * sin((vUv.x * 20.0 + vUv.y * 14.0) + uTime * 2.0 + vWave * 30.0);
          float fresnel = pow(1.0 - abs(vUv.y - 0.5) * 1.6, 2.0);
          vec3 color = mix(uColorB, uColorA, caustica * 0.45 + fresnel * 0.35);
          float alpha = 0.45 + caustica * 0.18 + fresnel * 0.2 + uFase * 0.02;
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.85));
        }
      `,
    });
    const agua = new THREE.Mesh(aguaGeo, aguaMat);
    agua.rotation.x = -Math.PI / 2.35;
    agua.position.set(0, -0.55, 0);
    escena.add(agua);

    // Partículas de cascada (chorro + niebla).
    const cantidad = 900;
    const posiciones = new Float32Array(cantidad * 3);
    const velocidades = new Float32Array(cantidad);
    const fases = new Float32Array(cantidad);
    for (let i = 0; i < cantidad; i += 1) {
      posiciones[i * 3] = (Math.random() - 0.5) * 0.55;
      posiciones[i * 3 + 1] = 0.2 + Math.random() * 1.6;
      posiciones[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
      velocidades[i] = 0.55 + Math.random() * 1.1;
      fases[i] = Math.random() * Math.PI * 2;
    }
    const particulasGeo = new THREE.BufferGeometry();
    particulasGeo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    const particulasMat = new THREE.PointsMaterial({
      color: new THREE.Color('#eaf7ff'),
      size: 0.035,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const particulas = new THREE.Points(particulasGeo, particulasMat);
    particulas.position.set(-0.85, 0.1, 0.2);
    escena.add(particulas);

    // Segundo chorro más suave (spray).
    const sprayGeo = particulasGeo.clone();
    const sprayMat = particulasMat.clone();
    sprayMat.opacity = 0.35;
    sprayMat.size = 0.05;
    sprayMat.color = new THREE.Color('#b7dcff');
    const spray = new THREE.Points(sprayGeo, sprayMat);
    spray.position.set(-0.7, 0.05, 0.05);
    escena.add(spray);

    escena.add(new THREE.AmbientLight(0xdff0ff, 0.9));
    const luz = new THREE.DirectionalLight(0xffffff, 1.2);
    luz.position.set(2, 3, 2);
    escena.add(luz);

    const ajustar = (): void => {
      const host = canvas.parentElement;
      const ancho = host?.clientWidth || 320;
      const alto = host?.clientHeight || 160;
      renderer.setSize(ancho, alto, false);
      camara.aspect = ancho / Math.max(alto, 1);
      camara.updateProjectionMatrix();
    };
    ajustar();

    let marco = 0;
    let visible = true;
    let tiempo = 0;
    const animar = (): void => {
      marco = requestAnimationFrame(animar);
      if (!visible) {
        return;
      }
      tiempo += 0.016;
      const fase = this.faseInterna();
      const energia = 1 + fase * 0.12;
      aguaMat.uniforms['uTime'].value = tiempo;
      aguaMat.uniforms['uFase'].value = fase;

      const pos = particulasGeo.getAttribute('position') as InstanceType<
        typeof THREE.BufferAttribute
      >;
      for (let i = 0; i < cantidad; i += 1) {
        let y = pos.getY(i) - velocidades[i] * 0.016 * energia;
        let x = pos.getX(i) + Math.sin(tiempo * 3 + fases[i]) * 0.0015;
        if (y < -0.55) {
          y = 1.55 + Math.random() * 0.35;
          x = (Math.random() - 0.5) * 0.5;
          pos.setZ(i, (Math.random() - 0.5) * 0.35);
        }
        pos.setY(i, y);
        pos.setX(i, x);
      }
      pos.needsUpdate = true;

      const sprayPos = sprayGeo.getAttribute('position') as InstanceType<
        typeof THREE.BufferAttribute
      >;
      for (let i = 0; i < cantidad; i += 1) {
        let y = sprayPos.getY(i) - velocidades[i] * 0.01 * energia;
        if (y < -0.5) {
          y = 1.4 + Math.random() * 0.4;
          sprayPos.setX(i, (Math.random() - 0.5) * 0.7);
        }
        sprayPos.setY(i, y);
      }
      sprayPos.needsUpdate = true;

      particulasMat.opacity = 0.55 + Math.min(fase, 6) * 0.04;
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
      aguaGeo.dispose();
      aguaMat.dispose();
      particulasGeo.dispose();
      particulasMat.dispose();
      sprayGeo.dispose();
      sprayMat.dispose();
      renderer.dispose();
    });
  }
}
