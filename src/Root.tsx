import React from 'react';
import {Composition, staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {Reel} from './Reel';
import {Intro} from './Intro';
import {DURACION_INTRO, TOTAL_DIAS} from './tiemposIntro';
import {DURACION, FPS} from './tiempos';
import {ReelJPR} from './jpr/Reel';
import {PruebaJPR, DURACION_PRUEBA} from './jpr/Prueba';
import {DURACION as DURACION_JPR} from './jpr/tiempos';
import {cargarFuentes} from './jpr/marca';

for (const peso of ['500', '800', '900']) {
	loadFont({family: 'Montserrat', url: staticFile(`fuentes/montserrat-latin-${peso}-normal.woff2`), weight: peso});
}

cargarFuentes();

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
		{/* Juan Pablo Ramos P. (JPR) */}
		<Composition id="jpr-prueba-piezas" component={PruebaJPR} durationInFrames={DURACION_PRUEBA} fps={FPS} width={1080} height={1920} />
		<Composition
			id="jpr-marcas-colaboran"
			component={ReelJPR}
			defaultProps={{transparente: false, criticos: false}}
			durationInFrames={DURACION_JPR}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	</>
);
