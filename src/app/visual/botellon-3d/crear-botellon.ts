import type {
  BufferGeometry,
  Group,
  Material,
  Mesh,
  ShaderMaterial,
  Texture,
} from 'three';

type ThreeModulo = typeof import('three');

export interface BotellonCreado {
  grupo: Group;
  superficieAgua: Mesh;
  materialSuperficie: ShaderMaterial;
  burbujas: Group;
  liberar: () => void;
}

/**
 * @description Perfil lathe del porrón real Cool Ice (cilindro con nervaduras y hombro).
 */
function perfilPorron(THREE: ThreeModulo): Array<InstanceType<typeof THREE.Vector2>> {
  // y: base → cuello. Nervaduras en -0.55, 0.05 y 0.55 aprox.
  return [
    new THREE.Vector2(0.01, -1.42),
    new THREE.Vector2(0.58, -1.42),
    new THREE.Vector2(0.64, -1.35),
    new THREE.Vector2(0.66, -1.15),
    new THREE.Vector2(0.67, -0.75),
    // nervadura inferior
    new THREE.Vector2(0.62, -0.62),
    new THREE.Vector2(0.67, -0.48),
    new THREE.Vector2(0.68, -0.1),
    // nervadura media
    new THREE.Vector2(0.63, 0.02),
    new THREE.Vector2(0.68, 0.14),
    new THREE.Vector2(0.68, 0.42),
    // nervadura superior
    new THREE.Vector2(0.63, 0.52),
    new THREE.Vector2(0.67, 0.62),
    new THREE.Vector2(0.66, 0.82),
    // hombro
    new THREE.Vector2(0.58, 0.98),
    new THREE.Vector2(0.42, 1.12),
    new THREE.Vector2(0.28, 1.22),
    new THREE.Vector2(0.22, 1.3),
    new THREE.Vector2(0.21, 1.38),
    new THREE.Vector2(0.24, 1.42),
  ];
}

/**
 * @description Construye el porrón según las fotos reales: plástico azul, sello, etiqueta y agua con superficie.
 */
export function crearBotellon(
  THREE: ThreeModulo,
  etiquetaTextura: Texture | null,
): BotellonCreado {
  const grupo = new THREE.Group();
  const liberables: Array<BufferGeometry | Material | Texture> = [];
  if (etiquetaTextura) {
    liberables.push(etiquetaTextura);
  }

  const geoCuerpo = new THREE.LatheGeometry(perfilPorron(THREE), 64);
  liberables.push(geoCuerpo);
  const matCuerpo = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#8ec8ef'),
    roughness: 0.08,
    metalness: 0.0,
    transmission: 0.78,
    thickness: 0.55,
    ior: 1.46,
    transparent: true,
    opacity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    attenuationColor: new THREE.Color('#4fa6de'),
    attenuationDistance: 1.4,
    envMapIntensity: 1.15,
  });
  liberables.push(matCuerpo);
  const cuerpo = new THREE.Mesh(geoCuerpo, matCuerpo);
  grupo.add(cuerpo);

  // Volumen de agua: cilindro interior hasta la línea de agua (bajo el hombro).
  const nivelAgua = 0.92;
  const radioAgua = 0.61;
  const geoVolumen = new THREE.CylinderGeometry(radioAgua, radioAgua * 0.98, nivelAgua + 1.28, 48, 1, false);
  liberables.push(geoVolumen);
  // Volumen interior muy transparente: el “agua” se lee sobre todo en la superficie libre.
  const matVolumen = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#4aa3df'),
    roughness: 0.02,
    metalness: 0,
    transmission: 0.82,
    thickness: 1.6,
    ior: 1.33,
    transparent: true,
    opacity: 0.42,
    attenuationColor: new THREE.Color('#0b5cab'),
    attenuationDistance: 1.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  liberables.push(matVolumen);
  const volumen = new THREE.Mesh(geoVolumen, matVolumen);
  volumen.position.y = (nivelAgua - 1.28) / 2;
  grupo.add(volumen);

  // Superficie libre del agua (disco ondulado) — esto es lo que “se siente” líquido.
  const geoSuperficie = new THREE.CircleGeometry(radioAgua * 0.985, 64);
  liberables.push(geoSuperficie);
  const materialSuperficie = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSlosh: { value: 0 },
      uTiltX: { value: 0 },
      uTiltZ: { value: 0 },
      uColor: { value: new THREE.Color('#5eb7f0') },
      uDeep: { value: new THREE.Color('#0b4f8c') },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uSlosh;
      uniform float uTiltX;
      uniform float uTiltZ;
      varying vec2 vUv;
      varying float vWave;

      void main() {
        vUv = uv;
        vec3 pos = position;
        float r = length(pos.xy);
        float onda =
          sin(pos.x * 9.0 + uTime * 3.2) * 0.01 +
          cos(pos.y * 8.0 - uTime * 2.6) * 0.008 +
          sin((pos.x + pos.y) * 6.5 + uTime * 2.1) * 0.006;
        float splash = uSlosh * (0.035 + 0.02 * sin(r * 14.0 - uTime * 6.0));
        pos.z += onda + splash * (1.0 - r);
        pos.z += uTiltX * pos.x * 0.35 + uTiltZ * pos.y * 0.35;
        vWave = onda + splash;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uDeep;
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;

      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        float fresnel = pow(1.0 - abs(dot(normalize(vec3(p, 0.55)), vec3(0.0, 0.0, 1.0))), 1.8);
        float caustica = 0.5 + 0.5 * sin((p.x * 32.0 + p.y * 22.0) + uTime * 2.8 + vWave * 55.0);
        float highlight = smoothstep(0.02, 0.0, abs(vWave - 0.012));
        vec3 color = mix(uDeep, uColor, 0.62 + caustica * 0.28);
        color += vec3(0.75, 0.9, 1.0) * (fresnel * 0.55 + highlight * 0.35);
        float alpha = 0.72 + fresnel * 0.28 + caustica * 0.1;
        alpha *= smoothstep(1.05, 0.78, r);
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.92));
      }
    `,
  });
  liberables.push(materialSuperficie);
  const superficieAgua = new THREE.Mesh(geoSuperficie, materialSuperficie);
  superficieAgua.rotation.x = -Math.PI / 2;
  superficieAgua.position.y = nivelAgua;
  grupo.add(superficieAgua);

  // Sello / tapa azul oscuro del cuello (como en las fotos).
  const geoSello = new THREE.CylinderGeometry(0.235, 0.255, 0.22, 32);
  liberables.push(geoSello);
  const matSello = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0a3d7a'),
    roughness: 0.35,
    metalness: 0.12,
  });
  liberables.push(matSello);
  const sello = new THREE.Mesh(geoSello, matSello);
  sello.position.y = 1.4;
  grupo.add(sello);

  const geoTapa = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 32);
  liberables.push(geoTapa);
  const tapa = new THREE.Mesh(geoTapa, matSello);
  tapa.position.y = 1.52;
  grupo.add(tapa);

  // Asa lateral integrada (perfil típico del bidón).
  const geoAsa = new THREE.TorusGeometry(0.22, 0.035, 10, 28, Math.PI * 1.05);
  liberables.push(geoAsa);
  const matAsa = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6eb6e4'),
    roughness: 0.25,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });
  liberables.push(matAsa);
  const asa = new THREE.Mesh(geoAsa, matAsa);
  asa.position.set(0.52, 0.78, 0);
  asa.rotation.y = Math.PI / 2;
  asa.rotation.z = -0.35;
  grupo.add(asa);

  // Etiqueta envolvente (opaca, como el papel real).
  const geoEtiqueta = new THREE.CylinderGeometry(0.682, 0.682, 0.72, 64, 1, true);
  liberables.push(geoEtiqueta);
  const matEtiqueta = new THREE.MeshStandardMaterial({
    color: etiquetaTextura ? new THREE.Color('#ffffff') : new THREE.Color('#e8f4fc'),
    map: etiquetaTextura,
    roughness: 0.62,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  liberables.push(matEtiqueta);
  const etiqueta = new THREE.Mesh(geoEtiqueta, matEtiqueta);
  etiqueta.position.y = -0.2;
  etiqueta.rotation.y = Math.PI * 0.15;
  grupo.add(etiqueta);

  // Burbujas ascendentes dentro del agua.
  const burbujas = new THREE.Group();
  const geoBurbuja = new THREE.SphereGeometry(1, 10, 10);
  liberables.push(geoBurbuja);
  const matBurbuja = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d7effc'),
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.2,
    transparent: true,
    opacity: 0.55,
  });
  liberables.push(matBurbuja);
  for (let i = 0; i < 14; i += 1) {
    const b = new THREE.Mesh(geoBurbuja, matBurbuja);
    const escala = 0.018 + Math.random() * 0.028;
    b.scale.setScalar(escala);
    b.position.set(
      (Math.random() - 0.5) * 0.9,
      -1.1 + Math.random() * 1.8,
      (Math.random() - 0.5) * 0.9,
    );
    b.userData['vel'] = 0.12 + Math.random() * 0.22;
    b.userData['fase'] = Math.random() * Math.PI * 2;
    burbujas.add(b);
  }
  grupo.add(burbujas);

  grupo.traverse((obj) => {
    const malla = obj as Mesh;
    if (malla.isMesh) {
      malla.castShadow = false;
      malla.receiveShadow = false;
    }
  });

  return {
    grupo,
    superficieAgua,
    materialSuperficie,
    burbujas,
    liberar: () => {
      for (const item of liberables) {
        item.dispose();
      }
    },
  };
}
