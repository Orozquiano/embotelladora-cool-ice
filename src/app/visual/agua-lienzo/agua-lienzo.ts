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
 * @class AguaLienzo
 * @description Lienzo WebGL con superficie líquida (Three.js) para el hero.
 * Se carga en diferido y respeta prefers-reduced-motion / Offline WebGL.
 */
@Component({
  selector: 'app-agua-lienzo',
  templateUrl: './agua-lienzo.html',
  styleUrl: './agua-lienzo.scss',
  host: {
    class: 'agua-lienzo',
    'aria-hidden': 'true',
  },
})
export class AguaLienzo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  /**
   * @description True cuando hay que mostrar el degradado estático.
   */
  protected readonly usarFallback = signal(false);

  constructor() {
    afterNextRender(() => {
      void this.iniciar();
    });
  }

  /**
   * @description Arranca Three.js solo si hay WebGL y motion permitido.
   */
  private async iniciar(): Promise<void> {
    const reducirMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducirMotion) {
      this.usarFallback.set(true);
      return;
    }

    const canvas = this.lienzo().nativeElement;
    let THREE: typeof import('three');
    try {
      THREE = await import('three');
    } catch {
      this.usarFallback.set(true);
      return;
    }

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

    const topePixel =
      window.matchMedia('(max-width: 48rem)').matches ||
      window.matchMedia('(pointer: coarse)').matches
        ? 1.25
        : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, topePixel));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camara.position.set(0, 0.15, 3.2);

    const geometria = new THREE.PlaneGeometry(6.4, 4.2, 96, 64);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColorA: { value: new THREE.Color('#9fd4f5') },
        uColorB: { value: new THREE.Color('#1e90ff') },
        uColorC: { value: new THREE.Color('#0b4f8c') },
        uHighlight: { value: new THREE.Color('#ffffff') },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec2 vUv;
        varying float vElevate;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float onda1 = sin(pos.x * 1.7 + uTime * 0.85) * 0.12;
          float onda2 = cos(pos.y * 2.1 - uTime * 0.65) * 0.09;
          float onda3 = sin((pos.x + pos.y) * 1.3 + uTime * 0.4) * 0.07;
          float elevacion = (onda1 + onda2 + onda3) * (1.0 - uScroll * 0.35);
          pos.z += elevacion;
          vElevate = elevacion;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform vec3 uHighlight;
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevate;

        void main() {
          float brillo = smoothstep(-0.12, 0.18, vElevate);
          float caustica = 0.5 + 0.5 * sin((vUv.x * 18.0 + vUv.y * 12.0) + uTime * 1.2);
          float fresnel = pow(1.0 - abs(vUv.y - 0.45), 2.2);
          vec3 base = mix(uColorA, uColorB, vUv.y + brillo * 0.25);
          base = mix(base, uColorC, fresnel * 0.55);
          base += uHighlight * (caustica * 0.08 + brillo * 0.18);
          float alpha = 0.62 + brillo * 0.28 + fresnel * 0.16;
          float vineta = smoothstep(0.02, 0.4, vUv.y) * smoothstep(1.08, 0.5, vUv.y);
          gl_FragColor = vec4(base, alpha * vineta);
        }
      `,
    });

    const malla = new THREE.Mesh(geometria, material);
    malla.rotation.x = -0.42;
    escena.add(malla);

    const gotaGeo = new THREE.IcosahedronGeometry(0.72, 3);
    const gotaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5eb8ef'),
      roughness: 0.14,
      metalness: 0.12,
      transparent: true,
      opacity: 0.88,
      emissive: new THREE.Color('#9fd4f5'),
      emissiveIntensity: 0.35,
    });
    const gota = new THREE.Mesh(gotaGeo, gotaMat);
    gota.position.set(1.55, 0.45, 0.85);
    escena.add(gota);

    const gotaChica = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.28, 2),
      gotaMat.clone(),
    );
    gotaChica.position.set(-1.7, -0.15, 0.6);
    escena.add(gotaChica);

    const luz = new THREE.DirectionalLight(0xffffff, 1.35);
    luz.position.set(2.5, 3, 4);
    escena.add(luz);
    escena.add(new THREE.AmbientLight(0xb7dcff, 0.65));

    const ajustar = (): void => {
      const host = canvas.parentElement;
      const ancho = host?.clientWidth || window.innerWidth;
      const alto = host?.clientHeight || Math.max(420, window.innerHeight * 0.72);
      renderer.setSize(ancho, alto, false);
      camara.aspect = ancho / Math.max(alto, 1);
      camara.updateProjectionMatrix();
    };
    ajustar();

    let marco = 0;
    let visible = true;
    let ultimo = performance.now();
    const reducirPorScroll = (): void => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      material.uniforms['uScroll'].value = Math.min(window.scrollY / max, 1);
    };

    const animar = (ahora: number): void => {
      marco = requestAnimationFrame(animar);
      if (!visible) {
        return;
      }
      const delta = Math.min((ahora - ultimo) / 1000, 0.05);
      ultimo = ahora;
      material.uniforms['uTime'].value += delta;
      const t = material.uniforms['uTime'].value;
      gota.position.y = 0.45 + Math.sin(t * 0.9) * 0.14;
      gota.rotation.y += delta * 0.4;
      gota.rotation.x = Math.sin(t * 0.4) * 0.25;
      gotaChica.position.y = -0.15 + Math.cos(t * 1.1) * 0.1;
      gotaChica.rotation.y -= delta * 0.55;
      renderer.render(escena, camara);
    };
    marco = requestAnimationFrame(animar);

    const onScroll = (): void => reducirPorScroll();
    const onResize = (): void => ajustar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const observador = new IntersectionObserver(
      (entradas) => {
        visible = entradas.some((entrada) => entrada.isIntersecting);
      },
      { threshold: 0.05 },
    );
    observador.observe(canvas);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(marco);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observador.disconnect();
      geometria.dispose();
      material.dispose();
      gotaGeo.dispose();
      gotaMat.dispose();
      gotaChica.geometry.dispose();
      (gotaChica.material as InstanceType<typeof THREE.MeshStandardMaterial>).dispose();
      renderer.dispose();
    });
  }
}
