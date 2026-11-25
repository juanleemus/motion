// Piezas tipo "Investing School" adaptadas a Invora: avatar con foto, balanza, medidor de miedo y codicia,
// termómetro del VIX, puntos de la historia, tarjetas de razón numeradas y celular con la app de Invora.
// Montserrat, azul Invora para lo que sube, rojo solo para lo que cae o es negativo.
import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {aparece, C, FUENTE, pulsoBeat, SOMBRA, useRebote} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ETQ: React.CSSProperties = {fontFamily: FUENTE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em'};
const sp = (frame: number, en: number) => spring({frame: frame - en, fps: 30, config: {damping: 11, mass: 0.6, stiffness: 160}});

// ---------- Avatar con foto en círculo (anillo azul) y nombre debajo ----------
export const Avatar: React.FC<{en: number; foto: string; nombre?: string; sub?: string; tam?: number; tono?: 'azul' | 'rojo'}> = ({en, foto, nombre, sub, tam = 200, tono = 'azul'}) => {
	const frame = useCurrentFrame();
	const r = sp(frame, en);
	const color = tono === 'rojo' ? C.rojo : C.azul;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: aparece(frame, en, 4), transform: `scale(${interpolate(r, [0, 1], [0.4, 1])})`}}>
			<div style={{width: tam, height: tam, borderRadius: '50%', overflow: 'hidden', border: `5px solid ${color}`, boxShadow: `0 0 ${30 + 12 * pulsoBeat(frame)}px ${tono === 'rojo' ? 'rgba(255,77,94,0.6)' : C.brillo}`, background: C.azulOscuro}}>
				<Img src={staticFile(foto)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%'}} />
			</div>
			{nombre ? <div style={{fontFamily: FUENTE, fontWeight: 900, fontSize: tam * 0.2, color: C.blanco, textShadow: SOMBRA}}>{nombre}</div> : null}
			{sub ? <div style={{...ETQ, fontSize: tam * 0.1, color: C.gris}}>{sub}</div> : null}
		</div>
	);
};

// ---------- Balanza: dos platillos con etiqueta; se inclina un poco y queda "en debate" ----------
export const Balanza: React.FC<{en: number; izq: string; der: string; centro: string; centroEn: number}> = ({en, izq, der, centro, centroEn}) => {
	const frame = useCurrentFrame();
	const r = sp(frame, en);
	const giro = Math.sin((frame - en) / 18) * 6 * Math.exp(-Math.max(0, frame - en) / 90) + Math.sin((frame - en) / 40) * 1.5;
	const W = 760;
	return (
		<div style={{position: 'relative', width: W, height: 560, opacity: aparece(frame, en, 5), transform: `translateY(${(1 - r) * 60}px)`}}>
			<svg width={W} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect x={W / 2 - 10} y={120} width={20} height={360} rx={8} fill="#c9d3e3" />
				<path d={`M ${W / 2 - 150} 500 L ${W / 2 + 150} 500 L ${W / 2 + 110} 470 L ${W / 2 - 110} 470 Z`} fill="#c9d3e3" />
				<circle cx={W / 2} cy={110} r={22} fill={C.azul} style={{filter: `drop-shadow(0 0 14px ${C.brillo})`}} />
				<g transform={`rotate(${giro} ${W / 2} 120)`}>
					<rect x={60} y={112} width={W - 120} height={14} rx={7} fill="#e3e8f0" />
					{[0, 1].map((k) => {
						const x = k ? W - 90 : 90;
						return (
							<g key={k}>
								<line x1={x} y1={126} x2={x - 70} y2={290} stroke="#c9d3e3" strokeWidth={4} />
								<line x1={x} y1={126} x2={x + 70} y2={290} stroke="#c9d3e3" strokeWidth={4} />
								<path d={`M ${x - 100} 290 Q ${x} 350 ${x + 100} 290 Z`} fill="#dfe6f0" stroke="#aab6c8" strokeWidth={3} />
							</g>
						);
					})}
				</g>
			</svg>
			{[izq, der].map((t, k) => (
				<div key={k} style={{position: 'absolute', top: 30, left: k ? W - 230 : 0, width: 230, textAlign: 'center', ...ETQ, fontSize: 24, color: C.tinta, background: k ? C.azul : '#ffd36b', borderRadius: 10, padding: '8px 0'}}>
					{t}
				</div>
			))}
			<div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', opacity: aparece(frame, centroEn, 5)}}>
				<div style={{...ETQ, fontSize: 30, color: C.blanco, background: C.tinta, border: `2px solid ${C.azul}`, borderRadius: 12, padding: '10px 22px'}}>{centro}</div>
			</div>
		</div>
	);
};

// ---------- Tarjetas de razón numeradas (01 · 02 · 03) ----------
export const Razones: React.FC<{items: {en: number; num: string; titulo: string; logo?: string; icono?: React.ReactNode}[]; activa?: number}> = ({items, activa}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap: 28}}>
			{items.map((it, i) => {
				const r = sp(frame, it.en);
				const on = activa === undefined ? frame >= it.en : i === activa;
				return (
					<div
						key={i}
						style={{
							width: 250,
							height: 250,
							borderRadius: 26,
							background: 'rgba(15,20,32,0.9)',
							border: `3px solid ${on ? C.rojo : 'rgba(255,255,255,0.15)'}`,
							boxShadow: on ? `0 0 ${24 + 10 * pulsoBeat(frame)}px rgba(255,77,94,0.45)` : undefined,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 16,
							opacity: aparece(frame, it.en, 4),
							transform: `translateY(${(1 - r) * 50}px) scale(${interpolate(r, [0, 1], [0.6, 1])})`,
							fontFamily: FUENTE,
						}}
					>
						<div style={{position: 'absolute', marginTop: -200, marginLeft: -170, ...ETQ, fontSize: 22, color: on ? C.rojo : C.gris}}>{it.num}</div>
						<div style={{width: 120, height: 120, borderRadius: 20, background: C.blanco, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							{it.logo ? <Img src={staticFile(`logos/${it.logo}`)} style={{maxWidth: 96, maxHeight: 70, objectFit: 'contain'}} /> : it.icono}
						</div>
						<div style={{...ETQ, fontSize: 22, color: C.blanco, textAlign: 'center', padding: '0 10px'}}>{it.titulo}</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- Medidor semicircular (miedo y codicia): la aguja baja hasta el valor ----------
export const MedidorMiedo: React.FC<{en: number; valor: number; bajaEn: number; titulo: string}> = ({en, valor, bajaEn, titulo}) => {
	const frame = useCurrentFrame();
	const r = sp(frame, en);
	const v = interpolate(frame, [bajaEn - 4, bajaEn + 20], [50, valor], {...clamp, easing: Easing.out(Easing.cubic)});
	const ang = Math.PI * (1 - v / 100);
	const R = 300, cx = 380, cy = 360;
	const arco = (a0: number, a1: number) => {
		const p = (a: number) => [cx + R * Math.cos(Math.PI * (1 - a)), cy - R * Math.sin(Math.PI * (1 - a))];
		const [x0, y0] = p(a0), [x1, y1] = p(a1);
		return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
	};
	const zonas: [number, number, string][] = [[0, 0.25, C.rojo], [0.25, 0.45, '#ff9b5e'], [0.45, 0.55, C.gris], [0.55, 0.75, '#7cc4ff'], [0.75, 1, C.azul]];
	return (
		<div style={{position: 'relative', width: 760, height: 520, opacity: aparece(frame, en, 5), transform: `scale(${interpolate(r, [0, 1], [0.8, 1])})`, fontFamily: FUENTE}}>
			<div style={{...ETQ, fontSize: 30, color: C.blanco, textAlign: 'center', marginBottom: 10}}>{titulo}</div>
			<svg width={760} height={440} style={{overflow: 'visible'}}>
				{zonas.map(([a, b, c], i) => (
					<path key={i} d={arco(a, b)} stroke={c} strokeWidth={48} fill="none" />
				))}
				<line x1={cx} y1={cy} x2={cx + (R - 60) * Math.cos(ang)} y2={cy - (R - 60) * Math.sin(ang)} stroke={C.blanco} strokeWidth={12} strokeLinecap="round" />
				<circle cx={cx} cy={cy} r={26} fill={C.blanco} />
				<text x={60} y={cy + 50} fill={C.rojo} fontFamily={FUENTE} fontWeight={800} fontSize={24}>
					MIEDO EXTREMO
				</text>
				<text x={560} y={cy + 50} fill={C.azul} fontFamily={FUENTE} fontWeight={800} fontSize={24}>
					CODICIA
				</text>
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontWeight: 900, fontSize: 96, color: v < 25 ? C.rojo : C.blanco, textShadow: SOMBRA}}>
				{Math.round(v)}
				<span style={{fontSize: 36, color: C.gris}}> / 100</span>
			</div>
		</div>
	);
};

// ---------- Termómetro del VIX con marcas (normal · miedo · pánico) ----------
export const TermometroVIX: React.FC<{en: number; pasos: {valor: number; en: number; etiqueta?: string}[]; max?: number}> = ({en, pasos, max = 60}) => {
	const frame = useCurrentFrame();
	const r = sp(frame, en);
	let v = 0;
	for (const p of pasos) v = frame >= p.en ? interpolate(frame, [p.en, p.en + 14], [v, p.valor], {...clamp, easing: Easing.out(Easing.cubic)}) : v;
	const H = 620, top = 40;
	const Y = (x: number) => top + H - (x / max) * H;
	const actual = [...pasos].reverse().find((p) => frame >= p.en);
	const color = v >= 35 ? C.rojo : v >= 20 ? '#ff9b5e' : C.azul;
	return (
		<div style={{position: 'relative', width: 760, height: 720, opacity: aparece(frame, en, 5), transform: `translateY(${(1 - r) * 40}px)`, fontFamily: FUENTE}}>
			<svg width={760} height={720} style={{overflow: 'visible'}}>
				<rect x={300} y={top} width={120} height={H} rx={60} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
				<rect x={316} y={Y(v)} width={88} height={top + H - Y(v) - 10} rx={44} fill={color} style={{filter: `drop-shadow(0 0 20px ${color})`}} />
				{[[20, 'NORMAL', C.azul], [30, 'MIEDO', '#ff9b5e'], [35, 'PÁNICO INTENSO', C.rojo]].map(([x, t, c]) => (
					<g key={String(t)}>
						<line x1={430} x2={470} y1={Y(Number(x))} y2={Y(Number(x))} stroke={String(c)} strokeWidth={4} />
						<text x={480} y={Y(Number(x)) + 9} fill={String(c)} fontFamily={FUENTE} fontWeight={800} fontSize={26}>
							{String(x)} · {String(t)}
						</text>
					</g>
				))}
			</svg>
			<div style={{position: 'absolute', left: 30, top: Y(v) - 50, fontWeight: 900, fontSize: 100, color, textShadow: SOMBRA}}>{Math.round(v)}</div>
			{actual?.etiqueta ? <div style={{position: 'absolute', left: 30, top: Y(v) + 60, ...ETQ, fontSize: 22, color: C.gris}}>{actual.etiqueta}</div> : null}
		</div>
	);
};

// ---------- Puntos de la historia: N veces, unos azules (subió) y otros rojos (bajó) ----------
export const PuntosHistoria: React.FC<{en: number; total: number; arriba: number; colorEn: number; abajoEn: number}> = ({en, total, arriba, colorEn, abajoEn}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', flexWrap: 'wrap', gap: 26, width: 760, justifyContent: 'center'}}>
			{Array.from({length: total}).map((_, i) => {
				const f = en + i * 3;
				const s = sp(frame, f);
				const esArriba = i < arriba;
				const pinta = esArriba ? frame >= colorEn + i * 2 : frame >= abajoEn;
				const color = !pinta ? 'rgba(255,255,255,0.25)' : esArriba ? C.azul : C.rojo;
				return (
					<div key={i} style={{width: 110, height: 110, borderRadius: '50%', background: color, boxShadow: pinta ? `0 0 22px ${esArriba ? C.brillo : 'rgba(255,77,94,0.6)'}` : undefined, opacity: aparece(frame, f, 3), transform: `scale(${interpolate(s, [0, 1], [0.3, 1])})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 44, color: C.tinta}}>
						{pinta ? (esArriba ? '▲' : '▼') : i + 1}
					</div>
				);
			})}
		</div>
	);
};

// ---------- Celular con la app de Invora: lista de "qué compran" ----------
export const CelularInvora: React.FC<{en: number; filas: {en: number; titulo: string; sub: string; foto?: string}[]}> = ({en, filas}) => {
	const frame = useCurrentFrame();
	const r = sp(frame, en);
	return (
		<div style={{width: 520, height: 900, borderRadius: 64, background: '#05080f', border: '10px solid #2b3446', boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 50px ${C.brillo}`, padding: '60px 30px', boxSizing: 'border-box', transform: `translateY(${(1 - r) * 200}px) rotate(${(1 - r) * -6}deg)`, opacity: aparece(frame, en, 5), fontFamily: FUENTE, display: 'flex', flexDirection: 'column', gap: 20}}>
			<div style={{fontWeight: 500, fontSize: 40, letterSpacing: '0.32em', color: C.blanco, textAlign: 'center'}}>INVORA</div>
			<div style={{width: 120, height: 5, background: C.azul, alignSelf: 'center', borderRadius: 3}} />
			<div style={{...ETQ, fontSize: 20, color: C.gris, marginTop: 10}}>Qué están comprando</div>
			{filas.map((f, i) => {
				const s = sp(frame, f.en);
				return (
					<div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: 16, borderRadius: 20, background: 'rgba(42,157,255,0.12)', border: `2px solid ${frame >= f.en ? C.azul : 'transparent'}`, opacity: aparece(frame, f.en, 4), transform: `translateX(${(1 - s) * 80}px)`}}>
						<div style={{width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', background: C.azulOscuro, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blanco, fontWeight: 900, fontSize: 30}}>
							{f.foto ? <Img src={staticFile(f.foto)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%'}} /> : f.titulo[0]}
						</div>
						<div>
							<div style={{fontWeight: 900, fontSize: 32, color: C.blanco}}>{f.titulo}</div>
							<div style={{fontWeight: 800, fontSize: 20, color: C.azul, letterSpacing: '0.12em', textTransform: 'uppercase'}}>{f.sub}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- Contador grande con etiqueta (103 veces · 97,5 M US$) ----------
export const Contador: React.FC<{en: number; valor: number; decimales?: number; antes?: string; despues?: string; etiqueta: string; tam?: number; color?: string}> = ({en, valor, decimales = 0, antes = '', despues = '', etiqueta, tam = 180, color = C.azul}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const p = interpolate(frame, [en, en + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const n = (valor * p).toFixed(decimales).replace('.', ',');
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: aparece(frame, en, 4), transform: `scale(${interpolate(r, [0, 1], [0.6, 1])})`, fontFamily: FUENTE}}>
			<div style={{fontWeight: 900, fontSize: tam, color, lineHeight: 1, textShadow: `0 0 40px ${color === C.rojo ? 'rgba(255,77,94,0.55)' : C.brillo}, ${SOMBRA}`, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
				{antes}
				{n}
				{despues}
			</div>
			<div style={{...ETQ, fontSize: 28, color: C.blanco, marginTop: 10}}>{etiqueta}</div>
		</div>
	);
};
