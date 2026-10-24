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

// Gráfica de barras 3D sobre una base: las barras crecen con rebote corto y la última es lima.
export const Barras3D: React.FC<{ancho: number; alto: number; desde: number}> = ({ancho, alto, desde}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alturas = [1.0, 1.6, 2.3, 3.4];
  return (
    <ThreeCanvas width={ancho} height={alto} camera={{fov: 30}} gl={{antialias: true, alpha: true}} style={{position: 'absolute', left: 0, top: 0}}>
      <Camara desde={[-5.5, 3.2, 9.5]} hasta={[-3.2, 2.6, 8.2]} mira={[0, 1.2, 0]} dur={110} />
      <Estudio />
      <group rotation={[0, interpolate(f, [0, 200], [0.35, 0.15]), 0]}>
        <RoundedBox args={[5.6, 0.18, 2.0]} radius={0.04} position={[0, -0.09, 0]}>
          <meshPhysicalMaterial {...satin(C.medianoche)} />
        </RoundedBox>
        {alturas.map((h, i) => {
          const s = spring({frame: f - desde - i * 6, fps, config: {damping: 200, stiffness: 90}});
          const hh = Math.max(0.02, h * s);
          const ultima = i === alturas.length - 1;
          return (
            <RoundedBox key={i} args={[0.9, hh, 0.9]} radius={Math.min(0.05, hh / 2.1)} position={[-1.95 + i * 1.3, hh / 2, 0]}>
              <meshPhysicalMaterial {...satin(ultima ? C.lima : C.electrico)} emissive={ultima ? '#7FA01A' : '#081E70'} emissiveIntensity={ultima ? 0.35 : 0.15} />
            </RoundedBox>
          );
        })}
      </group>
      <ContactShadows position={[0, -0.19, 0]} opacity={0.35} scale={14} blur={2.6} far={4} color={C.medianoche} frames={1} />
    </ThreeCanvas>
  );
};

// Línea 3D que se dibuja sobre un panel: para métricas que suben o bajan (CPA, costo por venta).
export const Linea3D: React.FC<{ancho: number; alto: number; desde: number; dur?: number}> = ({ancho, alto, desde, dur = 45}) => {
  const f = useCurrentFrame();
  const t = 1 - Math.pow(1 - Math.min(Math.max((f - desde) / dur, 0), 1), 3);
  const curva = useMemo(() => new THREE.CatmullRomCurve3(
    [[-2.4, -1.0], [-1.5, -0.75], [-0.6, -0.35], [0.3, -0.25], [1.2, 0.45], [2.3, 1.15]].map(([x, y]) => new THREE.Vector3(x, y, 0.12))), []);
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
