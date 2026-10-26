import {AbsoluteFill, Sequence} from 'remotion';
import {Captura, Chip, Dividida, FondoX, Golpe, Logo, TextoA, Titular, Zona} from '../../jpr/ui';
import {BAJA, Barras3D, Linea3D, Subasta3D} from '../../jpr/tres';
import {escena} from './tiempos';

// Capa de motion del reel "contenido-10": Amazon salió de Google Shopping y el CPC bajó; ahora vuelve a subir.
// La capa es transparente: lo que no es B, C ni D deja ver a Juan Pablo. Entre bloques, corte seco.

const Escena: React.FC<{id: Parameters<typeof escena>[0]; children: (e: ReturnType<typeof escena>) => React.ReactNode}> = ({id, children}) => {
  const e = escena(id);
  return <Sequence from={e.ini} durationInFrames={e.dur} name={id}>{children(e)}</Sequence>;
};

export const Contenido10: React.FC = () => (
  <AbsoluteFill>
    {/* 0–4 s: vacío. */}

    <Escena id="amazon">{({dur, en}) => (
      <Dividida tema="claro" dur={dur}>
        <Logo src="logos/amazon.png" alto={74} desde={en(4.12)} y={300} />
        <Zona><Titular texto="se fue" desde={12} y={442} tam={96} tema="claro" /></Zona>
        <Chip texto="julio 2025" desde={en(4.81)} y={560} tema="claro" />
        <div style={{position: 'absolute', top: 640, left: 0}}>
          <Subasta3D cerca={0.62} ancho={1080} alto={320} pilas={[
            {x: -2.1, monedas: 8, color: 'electrico'},
            {x: -0.7, monedas: 10, color: 'electrico'},
            {x: 0.7, monedas: 15, color: 'gris', sale: en(6.55)},
            {x: 2.1, monedas: 7, color: 'electrico'},
          ]} />
        </div>
      </Dividida>
    )}</Escena>

    <Escena id="noticia">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="claro" />
        <Captura src="capturas/contenido-10/amazon-noticia.png" w={1246} h={1180} ancho={860} y={470}
          recuadro={{x: 40, y: 164, w: 1152, h: 54}} recuadroDesde={en(9.05)}
          marcas={[{x: 488, y: 164, w: 704, h: 54}]} marcaDesde={en(10.73)}
          fuente="mediaincanada.com · 29 jul 2025" />
      </AbsoluteFill>
    )}</Escena>

    <Escena id="cpc-baja">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="claro" />
        <Zona><Titular texto="costo por clic" desde={en(13.8)} y={330} tam={96} tema="claro" /></Zona>
        <div style={{position: 'absolute', top: 470, left: 0}}>
          <Linea3D ancho={1080} alto={620} desde={6} dur={45} puntos={BAJA} />
        </div>
        <Zona><Golpe texto="BAJÓ" desde={en(14.52)} y={1130} tam={170} /></Zona>
      </AbsoluteFill>
    )}</Escena>

    <Escena id="optimizacion">{({en}) => <TextoA texto="¿optimización?" desde={en(17.92)} />}</Escena>

    <Escena id="cuota">{({dur, en}) => (
      <Dividida tema="claro" dur={dur}>
        <Zona><Titular texto="cuota de impresiones" desde={en(20.13)} y={310} tam={78} tema="claro" /></Zona>
        <div style={{position: 'absolute', top: 420, left: 0}}>
          <Barras3D ancho={1080} alto={540} desde={14} giro={[0.05, 0]} />
        </div>
      </Dividida>
    )}</Escena>

    <Escena id="no-era">{({en}) => <Zona><Golpe texto="NO ERA ASÍ" desde={en(22.8)} y={1365} tam={140} /></Zona>}</Escena>

    <Escena id="competencia">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="claro" />
        <Zona><Titular texto="menos competencia" desde={en(24.63)} y={320} tam={92} tema="claro" /></Zona>
        <div style={{position: 'absolute', top: 440, left: 0}}>
          <Subasta3D cerca={0.85} ancho={1080} alto={660} pilas={[
            {x: -2.25, monedas: 10, color: 'electrico', entra: 0, cambia: {en: en(27.93), a: 5}},
            {x: -0.75, monedas: 13, color: 'electrico', entra: 3, cambia: {en: en(27.93), a: 7}},
            {x: 0.75, monedas: 18, color: 'gris', entra: 6, sale: en(25.23)},
            {x: 2.25, monedas: 11, color: 'electrico', entra: 9, cambia: {en: en(27.93), a: 6}},
          ]} />
        </div>
        <Chip texto="la subasta baja" desde={en(29.4)} y={1140} tema="claro" />
        <Chip texto="mejores resultados" desde={en(31.42)} y={1300} tema="claro" />
      </AbsoluteFill>
    )}</Escena>

    <Escena id="gigantes">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="oscuro" />
        <Zona><Titular texto={'entraron otros\ngigantes'} desde={en(33.26)} y={310} tam={88} tema="oscuro" /></Zona>
        <div style={{position: 'absolute', top: 520, left: 0}}>
          <Subasta3D oscuro ancho={1080} alto={700} pilas={[
            {x: -2.4, monedas: 5, color: 'electrico'},
            {x: -1.2, monedas: 7, color: 'electrico'},
            {x: 0, monedas: 6, color: 'electrico'},
            {x: 1.2, monedas: 17, color: 'lima', entra: en(32.68)},
            {x: 2.4, monedas: 19, color: 'lima', entra: en(32.68) + 6},
          ]} />
        </div>
      </AbsoluteFill>
    )}</Escena>

    <Escena id="trimestre">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="oscuro" />
        <Zona><Titular texto={'CPC\n3er trimestre'} desde={en(35.15)} y={310} tam={88} tema="oscuro" /></Zona>
        <div style={{position: 'absolute', top: 520, left: 0}}>
          <Barras3D ancho={1080} alto={600} desde={0} alturas={[0.9, 3.6]} pasos={[en(38.44), en(39.1)]} giro={[0.05, 0]} />
        </div>
        <Zona><Golpe texto="+4%" desde={en(39.1)} y={1150} tam={170} /></Zona>
      </AbsoluteFill>
    )}</Escena>

    <Escena id="microsoft">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="oscuro" />
        <Logo src="logos/microsoft.png" alto={66} desde={en(40.6)} y={320} />
        <div style={{position: 'absolute', top: 500, left: 0}}>
          <Linea3D ancho={1080} alto={600} desde={10} dur={40} />
        </div>
        <Zona><Golpe texto="+16%" desde={en(42.04)} y={1150} tam={170} /></Zona>
      </AbsoluteFill>
    )}</Escena>

    <Escena id="no-depende">{({en}) => <TextoA texto="no depende solo de ti" desde={en(45.01)} tam={58} />}</Escena>

    <Escena id="quien-puja">{({dur, en}) => (
      <Dividida tema="claro" dur={dur}>
        <Zona><Titular texto="quién más puja" desde={en(47.12)} y={310} tam={92} tema="claro" /></Zona>
        <div style={{position: 'absolute', top: 440, left: 0}}>
          <Subasta3D cerca={0.8} ancho={1080} alto={520} pilas={[
            {x: -2.25, monedas: 8, color: 'electrico', entra: 8},
            {x: -0.75, monedas: 12, color: 'gris', entra: 11},
            {x: 0.75, monedas: 10, color: 'electrico', entra: 14},
            {x: 2.25, monedas: 14, color: 'lima', entra: 17},
          ]} />
        </div>
      </Dividida>
    )}</Escena>

    <Escena id="celebrar">{({en}) => <TextoA texto="antes de celebrar" desde={en(49.73)} />}</Escena>

    <Escena id="subastas">{({en}) => (
      <AbsoluteFill>
        <FondoX tema="claro" />
        <Captura src="capturas/contenido-10/subastas-google.png" w={1600} h={1100} ancho={860} y={560}
          recuadro={{x: 48, y: 62, w: 1214, h: 150}} recuadroDesde={en(52.18)}
          marcas={[{x: 1272, y: 280, w: 262, h: 40}, {x: 48, y: 328, w: 426, h: 40}]} marcaDesde={en(54.21)}
          fuente="support.google.com · Ayuda de Google Ads" />
      </AbsoluteFill>
    )}</Escena>

    <Escena id="al-lado">{({dur, en}) => (
      <Dividida tema="claro" dur={dur}>
        <Sequence durationInFrames={en(60.57)} layout="none">
          <Logo src="logos/google.svg" alto={62} desde={en(57.19)} y={300} />
          <Zona><Titular texto={'no compites contra\nel algoritmo'} desde={en(57.52)} y={430} tam={72} tema="claro" /></Zona>
        </Sequence>
        <Sequence from={en(60.57)} layout="none">
          <Zona><Golpe texto="EL DE AL LADO" desde={0} y={380} tam={130} /></Zona>
        </Sequence>
        <div style={{position: 'absolute', top: 600, left: 0}}>
          <Subasta3D cerca={0.6} ancho={1080} alto={360} pilas={[
            {x: -0.8, monedas: 9, color: 'electrico'},
            {x: 0.8, monedas: 9, color: 'gris', cambia: {en: en(60.83), a: 14}},
          ]} />
        </div>
      </Dividida>
    )}</Escena>

    <Escena id="guarda">{({en}) => (
      <AbsoluteFill>
        <TextoA texto="guarda este video" desde={en(62.35)} y={1300} />
        <Logo src="logos/google.svg" alto={38} desde={en(64.96)} y={1432} />
      </AbsoluteFill>
    )}</Escena>

    <Escena id="comparte">{({en}) => <TextoA texto={'compártelo con\ntu trafficker'} desde={en(65.56)} y={1340} tam={58} />}</Escena>

    <Escena id="sigueme">{({dur, en}) => (
      <Dividida tema="claro" dur={dur}>
        <Zona><Golpe texto="SÍGUEME" desde={en(69.04)} y={320} tam={150} /></Zona>
        <div style={{position: 'absolute', top: 540, left: 0}}>
          <Barras3D ancho={1080} alto={420} desde={4} giro={[0.05, 0]} />
        </div>
      </Dividida>
    )}</Escena>
  </AbsoluteFill>
);
