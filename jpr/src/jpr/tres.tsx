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

const vidrio = (color: string) => ({color, roughness: 0.18, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.3});

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
        <RoundedBox args={[5.6, 0.35, 2.2]} radius={0.16} position={[0, -0.18, 0]}>
          <meshPhysicalMaterial {...vidrio(C.medianoche)} />
        </RoundedBox>
        {alturas.map((h, i) => {
          const s = spring({frame: f - desde - i * 5, fps, config: {damping: 14, stiffness: 120, mass: 0.7}});
          const hh = Math.max(0.02, h * s);
          const ultima = i === alturas.length - 1;
          return (
            <RoundedBox key={i} args={[0.9, hh, 0.9]} radius={Math.min(0.14, hh / 2.1)} position={[-1.95 + i * 1.3, hh / 2, 0]}>
              <meshPhysicalMaterial {...vidrio(ultima ? C.lima : C.electrico)} emissive={ultima ? '#6E8F12' : '#0B2A9E'} emissiveIntensity={0.25} />
            </RoundedBox>
          );
        })}
      </group>
      <ContactShadows position={[0, -0.36, 0]} opacity={0.35} scale={14} blur={2.6} far={4} color={C.medianoche} frames={1} />
    </ThreeCanvas>
  );
};

// Ícono 3D de alerta: triángulo redondeado extruido en lima, con signo en medianoche. Flota y gira poco.
export const Alerta3D: React.FC<{ancho: number; alto: number; desde: number}> = ({ancho, alto, desde}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const r = 0.28, a = 1.55;
    const p = [new THREE.Vector2(0, a), new THREE.Vector2(-a * 0.95, -a * 0.7), new THREE.Vector2(a * 0.95, -a * 0.7)];
    p.forEach((pt, i) => {
      const prev = p[(i + 2) % 3], next = p[(i + 1) % 3];
      const d1 = prev.clone().sub(pt).normalize().multiplyScalar(r * 1.8);
      const d2 = next.clone().sub(pt).normalize().multiplyScalar(r * 1.8);
      const a1 = pt.clone().add(d1), a2 = pt.clone().add(d2);
      if (i === 0) s.moveTo(a1.x, a1.y); else s.lineTo(a1.x, a1.y);
      s.quadraticCurveTo(pt.x, pt.y, a2.x, a2.y);
    });
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {depth: 0.45, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 8, curveSegments: 24});
    g.center();
    return g;
  }, []);
  const e = spring({frame: f - desde, fps, config: {damping: 12, stiffness: 110}});
  const flota = Math.sin((f - desde) / 18) * 0.08;
  return (
    <ThreeCanvas width={ancho} height={alto} camera={{fov: 30, position: [0, 0.4, 9]}} gl={{antialias: true, alpha: true}} style={{position: 'absolute', left: 0, top: 0}}>
      <Estudio />
      <group position={[0, 0.2 + flota, 0]} scale={0.4 + 0.6 * e} rotation={[0.12, interpolate(f - desde, [0, 120], [-0.9, 0.35], {extrapolateRight: 'clamp'}) + (1 - e) * 1.5, 0]}>
        <mesh geometry={geo}>
          <meshPhysicalMaterial {...vidrio(C.lima)} emissive="#5C7A0A" emissiveIntensity={0.2} />
        </mesh>
        <RoundedBox args={[0.26, 1.0, 0.2]} radius={0.1} position={[0, 0.12, 0.42]}>
          <meshPhysicalMaterial {...vidrio(C.medianoche)} />
        </RoundedBox>
        <mesh position={[0, -0.68, 0.42]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial {...vidrio(C.medianoche)} />
        </mesh>
      </group>
      {[[-2.3, 1.6, -1, C.electrico, 0.22], [2.4, -1.2, -0.5, C.electrico, 0.16], [2.0, 1.9, -2, C.lima, 0.12], [-2.0, -1.7, -1.5, C.lima, 0.1]].map(([x, y, z, c, r], i) => (
        <mesh key={i} position={[x as number, (y as number) + Math.sin((f + i * 20) / 22) * 0.12, z as number]} scale={e}>
          <sphereGeometry args={[r as number, 32, 32]} />
          <meshPhysicalMaterial {...vidrio(c as string)} />
        </mesh>
      ))}
      <ContactShadows position={[0, -1.9, 0]} opacity={0.3} scale={8} blur={2.8} far={3} color={C.medianoche} frames={1} />
    </ThreeCanvas>
  );
};
