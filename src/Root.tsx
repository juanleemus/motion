import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Reel} from './Reel';
import {Intro} from './Intro';
import {DURACION_INTRO, TOTAL_DIAS} from './tiemposIntro';
import {DURACION, FPS} from './tiempos';
import {IntroPlanV} from './planv/IntroPlanV';
import {DURACION_OUTRO, OutroPlanV} from './planv/OutroPlanV';
import {DURACION_PLANV, FPS_PLANV} from './planv/tiempos';

for (const peso of ['500', '800', '900']) {
	loadFont({family: 'Montserrat', url: staticFile(`fuentes/montserrat-latin-${peso}-normal.woff2`), weight: peso});
}
loadFont({family: 'DM Serif Display', url: staticFile('fuentes/dmserif-400.woff2'), weight: '400'});
loadFont({family: 'DM Serif Display', url: staticFile('fuentes/dmserif-italic.woff2'), weight: '400', style: 'italic'});
loadFont({family: 'Inter', url: staticFile('fuentes/inter-400.woff2'), weight: '400'});
loadFont({family: 'Inter', url: staticFile('fuentes/inter-500.woff2'), weight: '500'});
loadFont({family: 'Space Mono', url: staticFile('fuentes/spacemono-400.woff2'), weight: '400'});
loadFont({family: 'Space Mono', url: staticFile('fuentes/spacemono-700.woff2'), weight: '700'});

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="dia5-uber-escuela-invora" component={Reel} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
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
		{/* Intro de plan v (podcast): horizontal para YouTube y vertical para reels */}
		<Composition id="planv-intro" component={IntroPlanV} durationInFrames={DURACION_PLANV} fps={FPS_PLANV} width={1920} height={1080} />
 		<Composition id="planv-outro" component={OutroPlanV} durationInFrames={DURACION_OUTRO} fps={FPS_PLANV} width={1920} height={1080} />
		<Composition id="planv-intro-vertical" component={IntroPlanV} durationInFrames={DURACION_PLANV} fps={FPS_PLANV} width={1080} height={1920} />
	</>
);
