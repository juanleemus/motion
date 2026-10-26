import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {ContactShadows, RoundedBox} from '@react-three/drei';
import {C} from '../../jpr/marca';
import * as THREE from 'three';
import {Estudio, satin} from '../../jpr/tres';

// Portada del reel "contenido-10" según el manual de marca (anatomía de la miniatura):
// gancho en el tercio superior, ícono 3D grande al centro, remate abajo y fondo Dashboard en 4 capas.
// Todo lo importante queda dentro del recorte 3:4 del perfil (y 240–1680).

// Capa 3 del fondo: dashboard desenfocado al 35 %, nunca nítido.
const Dashboard: React.FC = () => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.35, filter: 'blur(7px)'}}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <rect key={i} x={90 + i * 46} y={1260 - i * 38} width={30} height={160 + i * 38} rx={6} fill={C.electrico} />
    ))}
    <polyline points="610,1400 690,1340 760,1370 840,1250 930,1190 1010,1080" fill="none" stroke={C.electrico} strokeWidth={10} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={640 + i * 40} y={330 + i * 90} width={360 - i * 80} height={60} rx={10} fill="#1D3A7A" />
    ))}
    <circle cx={200} cy={1640} r={90} fill="none" stroke={C.lima} strokeOpacity={0.6} strokeWidth={22} strokeDasharray="380 200" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={700} y={1600 + i * 50} width={280 - i * 70} height={22} rx={6} fill="#2A4A8F" />
    ))}
  </svg>
);

// Flecha extruida con bisel: punta de 3D real, no un cono plano.
const flecha = (() => {
  const f = new THREE.Shape();
  f.moveTo(-0.3, 0); f.lineTo(0.3, 0); f.lineTo(0.3, 2.0); f.lineTo(0.8, 2.0); f.lineTo(0, 3.1); f.lineTo(-0.8, 2.0); f.lineTo(-0.3, 2.0); f.closePath();
  const g = new THREE.ExtrudeGeometry(f, {depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 6});
  g.translate(0, 0, -0.25);
  return g;
})();

// Ícono 3D: flecha lima gruesa que sale hacia arriba de un panel de vidrio con barras azules.
const Icono: React.FC = () => (
  <ThreeCanvas width={1080} height={900} camera={{fov: 30, position: [0.4, 0.9, 11]}} gl={{antialias: true, alpha: true}} style={{position: 'absolute', left: 0, top: 0}}>
    <Estudio />
    <group rotation={[0.05, -0.32, 0]} position={[0, -0.75, 0]}>
      {/* Panel de vidrio */}
      <RoundedBox args={[4.4, 2.6, 0.12]} radius={0.08} position={[0, 0, 0]}>
        <meshPhysicalMaterial color="#3D6BFF" roughness={0.15} metalness={0.1} transparent opacity={0.28} clearcoat={1} />
      </RoundedBox>
      <RoundedBox args={[4.44, 2.64, 0.06]} radius={0.08} position={[0, 0, -0.05]}>
        <meshBasicMaterial color={C.electrico} transparent opacity={0.18} />
      </RoundedBox>
      {[0.55, 0.85, 0.7, 1.15].map((h, i) => (
        <RoundedBox key={i} args={[0.5, h, 0.3]} radius={0.05} position={[-1.6 + i * 0.75, -1.1 + h / 2, 0.22]}>
          <meshPhysicalMaterial {...satin(C.electrico)} emissive="#081E70" emissiveIntensity={0.25} />
        </RoundedBox>
      ))}
      {/* Flecha */}
      <mesh geometry={flecha} position={[0.75, -0.35, 0.35]} rotation={[0, 0, -0.55]} scale={0.86}>
        <meshPhysicalMaterial {...satin(C.lima)} emissive="#7FA01A" emissiveIntensity={0.3} />
      </mesh>
    </group>
    <ContactShadows position={[0, -2.0, 0]} opacity={0.45} scale={12} blur={2.6} far={4} color="#000814" frames={1} />
  </ThreeCanvas>
);

export const Portada10: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.medianoche} 0%, ${C.profundo} 100%)`, overflow: 'hidden'}}>
    {/* Capa 2: luz azul detrás del ícono y un toque lima en la esquina */}
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(42% 26% at 50% 58%, rgba(47,95,255,0.55), transparent 70%), radial-gradient(30% 18% at 100% 0%, rgba(200,245,66,0.16), transparent 70%)'}} />
    <Dashboard />
    {/* Capa 4: viñeta; el tercio superior queda más oscuro para el titular */}
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(85% 60% at 50% 55%, transparent 55%, rgba(3,9,24,0.85) 100%), linear-gradient(180deg, rgba(5,14,34,0.75) 0%, rgba(5,14,34,0) 38%)'}} />

    {/* 2 · Ícono 3D */}
    <div style={{position: 'absolute', top: 640, left: 0}}><Icono /></div>

    {/* Logo de la plataforma de la que se habla */}
    <div style={{position: 'absolute', top: 905, left: 215}}>
      <div style={{background: C.blanco, borderRadius: 18, padding: '14px 26px', boxShadow: '0 16px 36px rgba(0,0,0,0.35)'}}>
        <Img src={staticFile('logos/google.svg')} style={{height: 46, display: 'block'}} />
      </div>
    </div>

    {/* 1 · Gancho: un solo bloque centrado; la línea blanca mide lo mismo que la palabra de golpe */}
    <div style={{position: 'absolute', top: 340, left: 70, width: 860, display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
        <div style={{font: '800 88px Poppins', color: C.blanco, letterSpacing: '-0.01em', lineHeight: 1, textAlign: 'center', whiteSpace: 'nowrap'}}>EL CPC VOLVIÓ A</div>
        <div style={{font: '400 334px Anton', color: C.lima, lineHeight: 0.9, textAlign: 'center', letterSpacing: '0.02em', marginTop: 4}}>SUBIR</div>
      </div>
    </div>

    {/* 3 · Remate */}
    <div style={{position: 'absolute', top: 1500, left: 70, width: 860, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: C.lima, color: C.medianoche, font: '800 68px Poppins', padding: '14px 46px', borderRadius: 999, letterSpacing: '0.01em'}}>+4% EN GOOGLE</div>
    </div>
  </AbsoluteFill>
);
