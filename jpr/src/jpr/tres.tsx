import {ThreeCanvas} from '@remotion/three';
import {ContactShadows, Environment, Lightformer, RoundedBox} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './marca';

// Luz de estudio: dos paneles suaves y un contraluz azul. No depende de archivos HDR.
const Estudio: React.FC = () => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[4, 8, 6]} intensity={1.6} />
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3} position={[0, 4, 6]} scale={[10, 4, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.5} position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6, 6, 1]} color={C.electrico} />
      <Lightformer form="rect" intensity={1.5} position={[6, 1, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 5, 1]} color={C.lima} />
    </Environment>
  </>
);

const Camara: React.FC<{desde: [number, number, number]; hasta: [number, number, number]; mira: [number, number, number]; dur: number}> = ({desde, hasta, mira, dur}) => {
  const f = useCurrentFrame();
  const {camera} = useThree();
  const t = 1 - Math.pow(1 - Math.min(f / dur, 1), 3);
  camera.position.set(...(desde.map((v, i) => v + (hasta[i] - v) * t) as [number, number, number]));
  camera.lookAt(...mira);
  return null;
};

// Acabado satinado: serio, sin brillo de juguete. El lima lleva menos metal para que conserve su color.
const satin = (color: string) => ({color, roughness: 0.38, metalness: color === C.lima ? 0.08 : 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3, envMapIntensity: 1.1});

// Gráfica de barras 3D sobre una base: las barras crecen sin rebote y la última es lima.
// `pasos` deja crecer cada barra en un fotograma propio (para que entre en la palabra exacta).
// `giro` es la rotación lenta del conjunto en radianes; en los reels va en máximo 3° (0,05).
export const Barras3D: React.FC<{ancho: number; alto: number; desde: number; alturas?: number[]; pasos?: number[]; giro?: [number, number]}> = ({ancho, alto, desde, alturas = [1.0, 1.6, 2.3, 3.4], pasos, giro = [0.35, 0.15]}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = alturas.length;
  const sep = 1.3;
  return (
    <ThreeCanvas width={ancho} height={alto} camera={{fov: 30}} gl={{antialias: true, alpha: true}} style={{position: 'absolute', left: 0, top: 0}}>
      <Camara desde={[-5.5, 3.2, 9.5]} hasta={[-3.2, 2.6, 8.2]} mira={[0, 1.2, 0]} dur={110} />
      <Estudio />
      <group rotation={[0, interpolate(f, [0, 200], giro, {extrapolateRight: 'clamp'}), 0]}>
        <RoundedBox args={[Math.max(5.6, n * sep + 0.4), 0.18, 2.0]} radius={0.04} position={[0, -0.09, 0]}>
          <meshPhysicalMaterial {...satin(C.medianoche)} />
        </RoundedBox>
        {alturas.map((h, i) => {
          const s = spring({frame: f - (pasos ? pasos[i] : desde + i * 6), fps, config: {damping: 200, stiffness: 90}});
          const hh = Math.max(0.02, h * s);
          const ultima = i === alturas.length - 1;
          return (
            <RoundedBox key={i} args={[0.9, hh, 0.9]} radius={Math.min(0.05, hh / 2.1)} position={[(i - (n - 1) / 2) * sep, hh / 2, 0]}>
              <meshPhysicalMaterial {...satin(ultima ? C.lima : C.electrico)} emissive={ultima ? '#7FA01A' : '#081E70'} emissiveIntensity={ultima ? 0.35 : 0.15} />
            </RoundedBox>
          );
        })}
      </group>
      <ContactShadows position={[0, -0.19, 0]} opacity={0.35} scale={14} blur={2.6} far={4} color={C.medianoche} frames={1} />
    </ThreeCanvas>
  );
};

const SUBE: [number, number][] = [[-2.4, -1.0], [-1.5, -0.75], [-0.6, -0.35], [0.3, -0.25], [1.2, 0.45], [2.3, 1.15]];
export const BAJA: [number, number][] = [[-2.4, 1.1], [-1.5, 0.95], [-0.6, 0.35], [0.3, 0.15], [1.2, -0.55], [2.3, -1.05]];

// Línea 3D que se dibuja sobre un panel: para métricas que suben o bajan (CPA, costo por venta).
export const Linea3D: React.FC<{ancho: number; alto: number; desde: number; dur?: number; puntos?: [number, number][]}> = ({ancho, alto, desde, dur = 45, puntos = SUBE}) => {
  const f = useCurrentFrame();
  const t = 1 - Math.pow(1 - Math.min(Math.max((f - desde) / dur, 0), 1), 3);
  const curva = useMemo(() => new THREE.CatmullRomCurve3(puntos.map(([x, y]) => new THREE.Vector3(x, y, 0.12))), [puntos]);
  const tubo = useMemo(() => new THREE.TubeGeometry(curva, 240, 0.06, 16, false), [curva]);
  tubo.setDrawRange(0, Math.floor((tubo.index?.count ?? 0) * t / 6) * 6);
  const p = curva.getPoint(Math.max(t, 0.001));
  const panel = Math.min(1, Math.max(0, (f - desde + 12) / 12));
  return (
    <ThreeCanvas width={ancho} height={alto} camera={{fov: 30}} gl={{antialias: true, alpha: true}} style={{position: 'absolute', left: 0, top: 0}}>
      <Camara desde={[1.6, 0.9, 9.4]} hasta={[0.9, 0.5, 8.6]} mira={[0, 0, 0]} dur={140} />
      <Estudio />
      <group rotation={[-0.08, -0.18, 0]} scale={0.94 + 0.06 * panel}>
        <RoundedBox args={[5.8, 3.3, 0.14]} radius={0.06} position={[0, 0, -0.1]}>
          <meshPhysicalMaterial {...satin(C.medianoche)} />
        </RoundedBox>
        {[-1.0, -0.33, 0.33, 1.0].map((y) => (
          <mesh key={y} position={[0, y, 0.0]}>
            <boxGeometry args={[5.2, 0.012, 0.01]} />
            <meshBasicMaterial color="#2A4A8F" />
          </mesh>
        ))}
        <mesh geometry={tubo}>
          <meshPhysicalMaterial {...satin(C.electrico)} emissive="#0B2A9E" emissiveIntensity={0.35} />
        </mesh>
        {t > 0.02 && (
          <mesh position={p}>
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshPhysicalMaterial {...satin(C.lima)} emissive="#4E6A08" emissiveIntensity={0.3} />
          </mesh>
        )}
      </group>
      <ContactShadows position={[0, -1.85, 0]} opacity={0.25} scale={10} blur={2.8} far={3} color={C.medianoche} frames={1} />
    </ThreeCanvas>
  );
};

export type Pila = {
  x: number;
  monedas: number;
  color: 'electrico' | 'lima' | 'gris';
  entra?: number; // fotograma en que la pila se arma
  sale?: number; // fotograma en que la pila se desarma (de arriba hacia abajo)
  cambia?: {en: number; a: number}; // fotograma en que la pila baja (o sube) hasta `a` monedas
};

const MONEDA = 0.13;

// Subasta 3D: pilas de fichas sobre una base, una por cada anunciante que puja.
// Las pilas se arman, bajan o se desarman; nada rebota y el conjunto gira menos de 3°.
// `cerca` acerca la cámara (1 = encuadre normal; menos de 1 = más cerca) para lienzos bajos.
export const Subasta3D: React.FC<{ancho: number; alto: number; pilas: Pila[]; oscuro?: boolean; cerca?: number}> = ({ancho, alto, pilas, oscuro, cerca = 1}) => {
  const f = useCurrentFrame();
  const sube = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
  return (
    <ThreeCanvas width={ancho} height={alto} camera={{fov: 30}} gl={{antialias: true, alpha: true}} style={{position: 'absolute', left: 0, top: 0}}>
      <Camara desde={[0.6 * cerca, 3.4 * cerca, 10.2 * cerca]} hasta={[0.2 * cerca, 3.0 * cerca, 9.4 * cerca]} mira={[0, 0.9, 0]} dur={150} />
      <Estudio />
      <group rotation={[0, interpolate(f, [0, 150], [-0.05, 0], {extrapolateRight: 'clamp'}), 0]}>
        <RoundedBox args={[6.4, 0.16, 2.2]} radius={0.04} position={[0, -0.08, 0]}>
          <meshPhysicalMaterial {...satin(oscuro ? '#13306B' : C.medianoche)} />
        </RoundedBox>
        {pilas.map((p, i) => {
          const armada = p.entra === undefined ? 1 : sube((f - p.entra) / 16);
          let n = p.monedas * armada;
          if (p.cambia) n = interpolate(sube((f - p.cambia.en) / 30), [0, 1], [n, p.cambia.a]);
          if (p.sale !== undefined) n *= 1 - sube((f - p.sale) / 14);
          const visibles = Math.ceil(n - 0.001);
          if (visibles <= 0) return null;
          return (
            <group key={i} position={[p.x, 0, 0]}>
              {Array.from({length: visibles}, (_, k) => {
                const parcial = Math.min(1, n - k);
                return (
                  <mesh key={k} position={[0, k * (MONEDA + 0.012) + (MONEDA * parcial) / 2, 0]} scale={[1, parcial, 1]}>
                    <cylinderGeometry args={[0.46, 0.46, MONEDA, 48]} />
                    <meshPhysicalMaterial {...satin(C[p.color])} emissive={p.color === 'lima' ? '#7FA01A' : p.color === 'electrico' ? '#081E70' : '#000000'} emissiveIntensity={p.color === 'gris' ? 0 : 0.2} />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>
      <ContactShadows position={[0, -0.17, 0]} opacity={0.35} scale={14} blur={2.6} far={4} color={C.medianoche} frames={1} />
    </ThreeCanvas>
  );
};
