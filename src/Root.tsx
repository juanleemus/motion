import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Reel} from './Reel';
import {Intro} from './Intro';
import {DURACION_INTRO, TOTAL_DIAS} from './tiemposIntro';
import {DURACION, FPS} from './tiempos';
import {ReelDia7} from './reels/dia7-energia/Reel';
import {DURACION as DURACION_DIA7} from './reels/dia7-energia/tiempos';
import {ReelDia8} from './reels/dia8-thiel/Reel';
import {DURACION as DURACION_DIA8} from './reels/dia8-thiel/tiempos';
import {ReelSemanaBolsa} from './reels/semana-bolsa/Reel';
import {DURACION as DURACION_SEMANA_BOLSA} from './reels/semana-bolsa/tiempos';
import {ReelNvidiaResultados} from './reels/nvidia-resultados/Reel';
import {DURACION as DURACION_NVIDIA_RESULTADOS} from './reels/nvidia-resultados/tiempos';
import {ReelAnthropicIpo} from './reels/anthropic-ipo/Reel';
import {DURACION as DURACION_ANTHROPIC_IPO} from './reels/anthropic-ipo/tiempos';
import {ReelGta6TakeTwo} from './reels/gta6-take-two/Reel';
import {DURACION as DURACION_GTA6} from './reels/gta6-take-two/tiempos';
import {ReelVentaTecnologicas} from './reels/venta-tecnologicas/Reel';
import {DURACION as DURACION_VENTA} from './reels/venta-tecnologicas/tiempos';
import {ReelTrumpNvidia} from './reels/trump-nvidia/Reel';
import {DURACION as DURACION_TRUMP} from './reels/trump-nvidia/tiempos';

for (const peso of ['500', '800', '900']) {
	loadFont({family: 'Montserrat', url: staticFile(`fuentes/montserrat-latin-${peso}-normal.woff2`), weight: peso});
}

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="dia5-uber-escuela-invora" component={Reel} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
		<Composition id="dia7-energia-escuela-invora" component={ReelDia7} durationInFrames={DURACION_DIA7} fps={FPS} width={1080} height={1920} />
		<Composition id="dia8-thiel-escuela-invora" component={ReelDia8} durationInFrames={DURACION_DIA8} fps={FPS} width={1080} height={1920} />
		<Composition id="semana-bolsa-escuela-invora" component={ReelSemanaBolsa} durationInFrames={DURACION_SEMANA_BOLSA} fps={FPS} width={1080} height={1920} />
		<Composition id="nvidia-resultados-escuela-invora" component={ReelNvidiaResultados} durationInFrames={DURACION_NVIDIA_RESULTADOS} fps={FPS} width={1080} height={1920} />
		<Composition id="anthropic-ipo-escuela-invora" component={ReelAnthropicIpo} durationInFrames={DURACION_ANTHROPIC_IPO} fps={FPS} width={1080} height={1920} />
		<Composition id="gta6-take-two-escuela-invora" component={ReelGta6TakeTwo} durationInFrames={DURACION_GTA6} fps={FPS} width={1080} height={1920} />
		<Composition id="venta-tecnologicas-escuela-invora" component={ReelVentaTecnologicas} durationInFrames={DURACION_VENTA} fps={FPS} width={1080} height={1920} defaultProps={{capa: 'preview' as const, solo: null}} />
		<Composition id="trump-nvidia-escuela-invora" component={ReelTrumpNvidia} durationInFrames={DURACION_TRUMP} fps={FPS} width={1080} height={1920} />
		{/* Intros "Día X de 12": una composición por día (dia1-escuela-invora … dia12-escuela-invora) */}
		{Array.from({length: TOTAL_DIAS}, (_, i) => i + 1).map((dia) => (
			<Composition
				key={dia}
				id={`dia${dia}-escuela-invora`}
				component={Intro}
				defaultProps={{dia}}
				durationInFrames={DURACION_INTRO}
				fps={FPS}
				width={1080}
				height={1920}
			/>
		))}
	</>
);
