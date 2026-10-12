import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Reel} from './Reel';
import {Intro} from './Intro';
import {DURACION_INTRO, TOTAL_DIAS} from './tiemposIntro';
import {DURACION, FPS} from './tiempos';

for (const peso of ['500', '800', '900']) {
	loadFont({family: 'Montserrat', url: staticFile(`fuentes/montserrat-latin-${peso}-normal.woff2`), weight: peso});
}

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
	</>
);
