// Glifos planos de línea (provisionales mientras llegan los íconos 3D del kit). viewBox 0 0 100 100.
import React from 'react';

const TRAZOS = {
	mundo: (
		<>
			<circle cx={50} cy={50} r={36} />
			<ellipse cx={50} cy={50} rx={15} ry={36} />
			<path d="M16 40 H84 M16 60 H84" />
		</>
	),
	tienda: (
		<>
			<path d="M16 42 L24 20 H76 L84 42 Z" />
			<path d="M16 42 Q25 52 33 42 Q42 52 50 42 Q58 52 67 42 Q75 52 84 42" />
			<path d="M24 48 V80 H76 V48" />
			<path d="M43 80 V60 H57 V80" />
		</>
	),
	megafono: (
		<>
			<path d="M18 42 V58 H32 L64 76 V24 L32 42 Z" />
			<path d="M30 58 L36 78 H44 L40 60" />
			<path d="M74 40 Q80 50 74 60 M82 32 Q92 50 82 68" />
		</>
	),
	union: (
		<>
			<circle cx={37} cy={50} r={22} />
			<circle cx={63} cy={50} r={22} />
		</>
	),
	billetes: (
		<>
			<rect x={14} y={30} width={72} height={42} rx={6} />
			<circle cx={50} cy={51} r={10} />
			<path d="M24 22 H82 Q90 22 90 30 V60" />
			<path d="M24 41 V41.1 M76 61 V61.1" />
		</>
	),
	persona: (
		<>
			<circle cx={50} cy={34} r={14} />
			<path d="M22 82 Q22 56 50 56 Q78 56 78 82" />
		</>
	),
	flecha: <path d="M24 50 H74 M56 32 L74 50 L56 68" />,
	check: <path d="M24 52 L43 70 L77 32" />,
} as const;

export type Glifo = keyof typeof TRAZOS;

export const Glifo: React.FC<{nombre: Glifo; color: string; tam: number; grosor?: number}> = ({nombre, color, tam, grosor = 7}) => (
	<svg viewBox="0 0 100 100" width={tam} height={tam} fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round">
		{TRAZOS[nombre]}
	</svg>
);
