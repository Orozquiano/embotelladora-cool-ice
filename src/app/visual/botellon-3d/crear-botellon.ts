import type { BufferGeometry, Group, Material, Mesh } from 'three';

type ThreeModulo = typeof import('three');

export interface BotellonCreado {
  grupo: Group;
  liberar: () => void;
}

/**
 * @description Construye un porrón/bidón de agua procedural (18,9 L) con plástico y líquido.
 */
export function crearBotellon(THREE: ThreeModulo): BotellonCreado {
  const grupo = new THREE.Group();
  const liberables: Array<BufferGeometry | Material> = [];

  const perfilCuerpo = [
    new THREE.Vector2(0.01, -1.25),
    new THREE.Vector2(0.58, -1.25),
    new THREE.Vector2(0.66, -1.05),
    new THREE.Vector2(0.7, -0.55),
    new THREE.Vector2(0.68, 0.05),
    new THREE.Vector2(0.58, 0.55),
    new THREE.Vector2(0.36, 0.88),
    new THREE.Vector2(0.22, 1.02),
    new THREE.Vector2(0.2, 1.18),
    new THREE.Vector2(0.24, 1.28),
  ];

  const geoCuerpo = new THREE.LatheGeometry(perfilCuerpo, 48);
  liberables.push(geoCuerpo);
  const matCuerpo = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#9fd4f5'),
    roughness: 0.22,
    metalness: 0.08,
    transparent: true,
    opacity: 0.55,
    emissive: new THREE.Color('#d7effc'),
    emissiveIntensity: 0.12,
  });
  liberables.push(matCuerpo);
  grupo.add(new THREE.Mesh(geoCuerpo, matCuerpo));

  const perfilAgua = [
    new THREE.Vector2(0.01, -1.18),
    new THREE.Vector2(0.52, -1.18),
    new THREE.Vector2(0.58, -0.95),
    new THREE.Vector2(0.6, -0.35),
    new THREE.Vector2(0.56, 0.15),
    new THREE.Vector2(0.45, 0.45),
    new THREE.Vector2(0.01, 0.45),
  ];
  const geoAgua = new THREE.LatheGeometry(perfilAgua, 40);
  liberables.push(geoAgua);
  const matAgua = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a7fd6'),
    roughness: 0.12,
    metalness: 0.02,
    transparent: true,
    opacity: 0.82,
    emissive: new THREE.Color('#3aa0ef'),
    emissiveIntensity: 0.2,
  });
  liberables.push(matAgua);
  grupo.add(new THREE.Mesh(geoAgua, matAgua));

  const geoTapa = new THREE.CylinderGeometry(0.23, 0.25, 0.16, 32);
  liberables.push(geoTapa);
  const matTapa = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0b4f8c'),
    roughness: 0.35,
    metalness: 0.15,
  });
  liberables.push(matTapa);
  const tapa = new THREE.Mesh(geoTapa, matTapa);
  tapa.position.y = 1.36;
  grupo.add(tapa);

  const geoAsa = new THREE.TorusGeometry(0.28, 0.045, 12, 40, Math.PI * 1.15);
  liberables.push(geoAsa);
  const matAsa = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#083a68'),
    roughness: 0.4,
    metalness: 0.1,
  });
  liberables.push(matAsa);
  const asa = new THREE.Mesh(geoAsa, matAsa);
  asa.position.set(0.02, 0.95, 0.28);
  asa.rotation.x = Math.PI / 2.1;
  asa.rotation.z = -0.15;
  grupo.add(asa);

  const geoEtiqueta = new THREE.CylinderGeometry(0.705, 0.685, 0.42, 48, 1, true);
  liberables.push(geoEtiqueta);
  const matEtiqueta = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.55,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  liberables.push(matEtiqueta);
  const etiqueta = new THREE.Mesh(geoEtiqueta, matEtiqueta);
  etiqueta.position.y = -0.15;
  grupo.add(etiqueta);

  const geoFranja = new THREE.CylinderGeometry(0.71, 0.69, 0.08, 48, 1, true);
  liberables.push(geoFranja);
  const matFranja = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0b4f8c'),
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  liberables.push(matFranja);
  const franja = new THREE.Mesh(geoFranja, matFranja);
  franja.position.y = 0.02;
  grupo.add(franja);

  grupo.traverse((obj) => {
    const malla = obj as Mesh;
    if (malla.isMesh) {
      malla.castShadow = false;
      malla.receiveShadow = false;
    }
  });

  return {
    grupo,
    liberar: () => {
      for (const item of liberables) {
        item.dispose();
      }
    },
  };
}
