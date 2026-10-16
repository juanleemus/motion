// Capa de motion graphics (transparente donde se ve a JPR).
import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {Barra, Chip, Cifra, Completo, Cta, Destello, Firma, FondoX, Icono, JPR, Linea, Marcador, PalabraGigante, POPPINS, Split, TarjetaLogo, useEntrada} from '../../jpr/ui';
import {DURACION, ESCRIBE_ENLACES, K, TEXTO_ENLACES} from './datos';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Posiciona un hijo con su centro en (x, y).
const En: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)'}}>{children}</div>
);
// Monta un hijo a partir del fotograma absoluto `f` dentro de una escena que empieza en `base`.
const Desde: React.FC<{f: number; base: number; children: React.ReactNode; hasta?: number}> = ({f, base, children, hasta}) => (
  <Sequence from={f - base} durationInFrames={hasta ? hasta - f : undefined} layout="none">{children}</Sequence>
);
// Desvanece su contenido en 6 fotogramas al llegar a `fin` (fotograma relativo a la escena).
const SaleEn: React.FC<{fin: number; children: React.ReactNode}> = ({fin, children}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [fin - 6, fin], [0, 1], clamp);
  return <AbsoluteFill style={{opacity: 1 - p, filter: p > 0 ? `blur(${p * 14}px)` : undefined}}>{children}</AbsoluteFill>;
};
// Círculo azul medianoche con un ícono lima (bloqueo / corte) que aparece con un pequeño rebote.
const Sello: React.FC<{nombre: 'bloqueo' | 'corte'}> = ({nombre}) => {
  const p = useEntrada(0);
  return (
    <div style={{width: 110, height: 110, borderRadius: 55, background: JPR.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 2), boxShadow: '0 10px 26px rgba(10,31,68,0.25)'}}>
      <Icono nombre={nombre} size={62} grosor={2.4} />
    </div>
  );
};

// ---------------------------------------------------------------- B1
const B1: React.FC = () => {
  const b = K.b1;
  return (
    <Split dur={K.c1 - b + 8}>
      <Desde f={K.logoFb} base={b}><En x={330} y={450}><TarjetaLogo logo="facebook" size={200} etiqueta="Facebook" /></En></Desde>
      <Desde f={K.o} base={b}><En x={540} y={430}><div style={{fontFamily: POPPINS, fontWeight: 500, fontSize: 52, color: JPR.gris}}>o</div></En></Desde>
      <Desde f={K.logoIg} base={b}><En x={750} y={450}><TarjetaLogo logo="instagram" size={200} etiqueta="Instagram" /></En></Desde>
      <Desde f={K.chipRevisar} base={b}><En x={500} y={680}><Chip icono="buscar" texto="revisar tus campañas" rot={-1.5} /></En></Desde>
      <Desde f={K.chipHoy} base={b}><En x={590} y={800}><Chip icono="reloj" texto="hoy mismo" rot={1.5} /></En></Desde>
    </Split>
  );
};

// ---------------------------------------------------------------- C1
const C1: React.FC = () => {
  const b = K.c1;
  return (
    <Completo dur={K.c1Fin - b}>
      <Desde f={K.logoMeta1} base={b}><En x={500} y={560}><TarjetaLogo logo="meta" size={300} etiqueta="Meta" /></En></Desde>
      <Desde f={K.chipBloquear} base={b}><En x={480} y={900}><Chip icono="candado" texto="bloquear cuentas" rot={-1.5} /></En></Desde>
      <Desde f={K.chipAviso} base={b}><En x={540} y={1020}><Chip icono="alerta" texto="sin previo aviso" rot={1.5} /></En></Desde>
    </Completo>
  );
};

// ---------------------------------------------------------------- B2: el puente
const B2: React.FC = () => {
  const b = K.b2;
  return (
    <Split dur={K.c2 - b + 8}>
      <Linea x1={420} y1={470} x2={660} y2={470} retraso={K.lineaPuente - b} dur={K.logoTiktok1 - K.lineaPuente} resalta={K.puente - b} corte={K.cerro - b} grosor={8} />
      <Desde f={K.logoMeta2} base={b}><En x={310} y={500}><TarjetaLogo logo="meta" size={200} etiqueta="Meta" /></En></Desde>
      <Desde f={K.logoTiktok1} base={b}><En x={770} y={500}><TarjetaLogo logo="tiktok" size={200} etiqueta="TikTok" /></En></Desde>
      <Desde f={K.chipTodos} base={b} hasta={K.puente}>
        <SaleEn fin={K.puente - K.chipTodos}><En x={540} y={770}><Chip icono="usuarios" texto="la estrategia de todos" rot={-1} /></En></SaleEn>
      </Desde>
      <Desde f={K.cerro} base={b}><En x={540} y={470}><Sello nombre="corte" /></En></Desde>
    </Split>
  );
};

// ---------------------------------------------------------------- C2: guerra y 7 mercados
const C2: React.FC = () => {
  const b = K.c2;
  return (
    <Completo dur={K.c2Fin - b}>
      <Desde f={K.logoMeta3} base={b} hasta={K.cifra7}>
        <SaleEn fin={K.cifra7 - K.logoMeta3}>
          <En x={300} y={760}><TarjetaLogo logo="meta" size={250} etiqueta="Meta" /></En>
          <Desde f={K.guerra} base={K.logoMeta3}><En x={540} y={430}><PalabraGigante><Marcador retraso={2}>guerra</Marcador></PalabraGigante></En></Desde>
          <Desde f={K.logoByte} base={K.logoMeta3}><En x={780} y={760}><TarjetaLogo logo="bytedance" size={250} etiqueta="ByteDance" /></En></Desde>
        </SaleEn>
      </Desde>
      <Desde f={K.cifra7} base={b}><En x={540} y={560}><Cifra valor={7} size={300} /></En></Desde>
      <Desde f={K.mercados} base={b}><En x={540} y={790}><PalabraGigante size={84}><Marcador>mercados clave</Marcador></PalabraGigante></En></Desde>
      <Desde f={K.chipEEUU} base={b}><En x={540} y={990}><Chip icono="pin" texto="Estados Unidos" rot={-1.5} /></En></Desde>
    </Completo>
  );
};

// ---------------------------------------------------------------- B3: no es solo para ellos
const B3: React.FC = () => {
  const b = K.b3;
  return (
    <Split dur={K.b3Fin - b}>
      <Desde f={K.prohibicion} base={b}><En x={540} y={390}><PalabraGigante size={120}><Marcador retraso={2}>prohibición</Marcador></PalabraGigante></En></Desde>
      <Desde f={K.ellos} base={b}><En x={540} y={590}><TarjetaLogo logo="bytedance" size={150} apagado={1} /></En></Desde>
      <Desde f={K.chipMarca} base={b}><En x={355} y={790}><Chip icono="etiqueta" texto="marca" rot={-2} /></En></Desde>
      <Desde f={K.chipCreador} base={b}><En x={700} y={800}><Chip icono="usuario" texto="creador" rot={1.5} /></En></Desde>
    </Split>
  );
};

// ---------------------------------------------------------------- C3: tu anuncio → TikTok, bloqueado
const C3: React.FC = () => {
  const b = K.c3;
  return (
    <Completo dur={K.c3Fin - b}>
      <Linea x1={455} y1={780} x2={640} y2={780} retraso={K.lineaTrafico - b} dur={K.logoTiktok2 - K.lineaTrafico} corte={K.bloqueo - b} grosor={8} />
      <Desde f={K.chipAnuncio} base={b}><En x={275} y={780}><Chip icono="megafono" texto="tu anuncio" /></En></Desde>
      <Desde f={K.logoTiktok2} base={b}><En x={770} y={810}><TarjetaLogo logo="tiktok" size={220} etiqueta="TikTok" /></En></Desde>
      <Desde f={K.bloqueo} base={b}><En x={548} y={780}><Sello nombre="bloqueo" /></En></Desde>
    </Completo>
  );
};

// ---------------------------------------------------------------- B4: alimentar a la competencia se acabó
const B4: React.FC = () => {
  const b = K.b4;
  return (
    <Split dur={K.b4Fin - b}>
      <Desde f={K.logoMeta4} base={b}><En x={540} y={450}><TarjetaLogo logo="meta" size={210} etiqueta="Meta" /></En></Desde>
      <Desde f={K.barra} base={b}><En x={540} y={740}><Barra ancho={780} desde={0} hasta={K.barraLlena - K.barra} etiqueta="alimentar a su competencia" /></En></Desde>
    </Split>
  );
};

// ---------------------------------------------------------------- B5: a quién mandárselo
const B5: React.FC = () => {
  const b = K.b5;
  return (
    <Split dur={K.b5Fin - b}>
      <Desde f={K.chipBuyer} base={b}><En x={470} y={390}><Chip icono="usuario" texto="media buyer" rot={-1.5} /></En></Desde>
      <Desde f={K.chipAgencia} base={b}><En x={600} y={530}><Chip icono="edificio" texto="agencia" rot={1.5} /></En></Desde>
      <Desde f={K.chipEnlaces} base={b}><En x={540} y={680}><Chip icono="enlace" texto={TEXTO_ENLACES} escribe={ESCRIBE_ENLACES} resalta="hoy" rot={-1} /></En></Desde>
    </Split>
  );
};

// ---------------------------------------------------------------- cierre
const CierreCta: React.FC = () => (
  <SaleEn fin={K.firma - K.cta}><En x={540} y={1310}><Cta palabra="SÍGUEME" /></En></SaleEn>
);
const CierreFirma: React.FC = () => (
  <AbsoluteFill style={{opacity: interpolate(useCurrentFrame(), [0, 4], [0, 1], clamp)}}>
    <FondoX dur={DURACION - K.firma} />
    <En x={540} y={860}><Firma size={150} retraso={2} /></En>
  </AbsoluteFill>
);

const Sec: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => (
  <Sequence from={a} durationInFrames={b - a}>{children}</Sequence>
);

export const Motion: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'transparent'}}>
    <Sec a={K.b1} b={K.c1 + 8}><B1 /></Sec>
    <Sec a={K.c1} b={K.c1Fin}><C1 /></Sec>
    <Sec a={K.b2} b={K.c2 + 8}><B2 /></Sec>
    <Sec a={K.c2} b={K.c2Fin}><C2 /></Sec>
    <Sec a={K.c3} b={K.c3Fin}><C3 /></Sec>
    <Sec a={K.b3} b={K.b3Fin}><B3 /></Sec>
    <Sec a={K.b4} b={K.b4Fin}><B4 /></Sec>
    <Sec a={K.b5} b={K.b5Fin}><B5 /></Sec>
    <Sec a={K.cta} b={K.firma}><CierreCta /></Sec>
    <Sec a={K.firma} b={DURACION}><CierreFirma /></Sec>
    <Sec a={K.destello1} b={K.destello1 + 8}><Destello /></Sec>
    <Sec a={K.destello2} b={K.destello2 + 8}><Destello /></Sec>
    <Sec a={K.destello3} b={K.destello3 + 8}><Destello /></Sec>
  </AbsoluteFill>
);
