// Convierte escenas.json en un plan con fotogramas exactos y la lista de efectos de sonido.
// Lo usan la composición (para animar) y el script de render (para el audio y la hoja de montaje),
// así imagen y sonido salen siempre de la misma fuente. Sin React aquí.

export type Tiempo = number | string; // segundos (8.4) o "mm:ss:ff" (00:08:12)
export type Tramo = 'mitad' | 'completa' | 'a-camara';
export const PIEZAS = [
  'Texto', 'Chip', 'PilaChips', 'Barra', 'Cifra', 'Grafica', 'TarjetaLogo', 'Captura',
  'IconoApp', 'Nodos', 'Comparacion', 'Cta', 'Firma',
  // piezas de impacto (ESTILO.md §5b): palabras que golpean, pantallas que se usan, video y personas
  'Palabras', 'Buscador', 'Video', 'Multitud', 'Clip',
] as const;
export type Pieza = (typeof PIEZAS)[number];
export type TipoSonido = 'whoosh' | 'pop' | 'tic' | 'clic' | 'tecleo' | 'trazo' | 'golpe';
export type Icono = 'alerta' | 'check' | 'x' | 'sube' | 'baja' | 'reloj' | 'rayo' | 'usuario' | 'dinero' | 'grafica' | 'comentario' | 'numero';

export interface EscenaJson {
  inicio: Tiempo;
  fin: Tiempo;
  tramo: string;
  pieza?: Pieza;
  texto?: string;
  textoEn?: Tiempo;
  insignia?: {numero: number | string; etiqueta: string; puntos?: number; actual?: number; en?: Tiempo};
  destello?: boolean;
  fondo?: 'claro' | 'oscuro';
  datos?: any;
  nota?: string;
}
export interface MusicaJson {
  bpm?: number;
  golpes?: Tiempo[]; // impactos con subida antes (cambios de bloque grandes)
  pausas?: [Tiempo, Tiempo][]; // tramos donde la batería se apaga
  final?: Tiempo; // golpe final (firma)
}
export interface ReelJson {
  nombre: string;
  fps: number;
  duracion: Tiempo;
  escenas: EscenaJson[];
  musica?: MusicaJson;
  sinFondo?: boolean; // solo para montar el video final: capa de gráficos sin el fondo x
}

export interface Sonido {tipo: TipoSonido; frame: number; ganancia: number; escena: number}
export interface EscenaPlan {
  i: number;
  desde: number; // fotograma absoluto donde empieza
  hasta: number; // fotograma absoluto donde termina (exclusivo)
  dur: number;
  tramo: Tramo;
  pieza?: Pieza;
  texto?: string;
  textoF: number; // relativo a la escena
  insignia?: {numero: string; etiqueta: string; puntos: number; actual: number; f: number};
  destello: boolean;
  oscuro: boolean;
  d: any; // datos de la pieza con tiempos ya en fotogramas relativos
  momentos: number[]; // fotogramas relativos donde algo se mueve (para la hoja de movimiento)
  nota?: string;
}
export interface Plan {
  nombre: string;
  fps: number;
  total: number;
  escenas: EscenaPlan[];
  sonidos: Sonido[];
  avisos: string[];
  musica?: {bpm: number; golpes: number[]; pausas: [number, number][]; final?: number}; // en segundos
}

// ---------- tiempos ----------
export const segundos = (t: Tiempo | undefined, fps: number): number | undefined => {
  if (t === undefined || t === null) return undefined;
  if (typeof t === 'number') return t;
  const p = t.trim().split(':').map(Number);
  if (p.some((n) => Number.isNaN(n))) throw new Error(`Tiempo no válido: "${t}"`);
  if (p.length === 3) return p[0] * 60 + p[1] + p[2] / fps; // mm:ss:ff
  if (p.length === 2) return p[0] * 60 + p[1]; // mm:ss(.xx)
  return p[0];
};
export const aFotograma = (t: Tiempo, fps: number) => Math.round((segundos(t, fps) ?? 0) * fps);
export const formato = (f: number, fps: number) => {
  const s = Math.floor(f / fps);
  const ff = f - s * fps;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(Math.floor(s / 60))}:${p(s % 60)}:${p(ff)}`;
};
const tramoDe = (t: string): Tramo => {
  const n = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s_]+/g, '-');
  if (n === 'mitad' || n === 'completa' || n === 'a-camara') return n;
  throw new Error(`Tramo no válido: "${t}" (usa mitad, completa o a-camara)`);
};

// ---------- texto con acento ----------
// *palabra* → Lora Italic azul eléctrico · [palabra] → marcador lima detrás · {palabra} → azul eléctrico
export type Estilo = 'normal' | 'lora' | 'marcador' | 'azul';
export const partesTexto = (texto: string): {t: string; estilo: Estilo}[] =>
  texto
    .split(/(\*[^*]+\*|\[[^\]]+\]|\{[^}]+\})/)
    .filter(Boolean)
    .map((t) => {
      if (t.startsWith('*')) return {t: t.slice(1, -1), estilo: 'lora' as const};
      if (t.startsWith('[')) return {t: t.slice(1, -1), estilo: 'marcador' as const};
      if (t.startsWith('{')) return {t: t.slice(1, -1), estilo: 'azul' as const};
      return {t, estilo: 'normal' as const};
    });
const contarPalabras = (s: string) => s.split(/\s+/).filter(Boolean).length;

// ---------- planificación ----------
export const planificar = (reel: ReelJson): Plan => {
  const fps = reel.fps;
  if (!fps || fps < 10 || fps > 60) throw new Error(`fps no válido: ${fps}`);
  const total = Math.round((segundos(reel.duracion, fps) ?? 0) * fps);
  if (total <= 0) throw new Error('La duración del reel debe ser mayor que 0');
  const avisos: string[] = [];
  const sonidos: Sonido[] = [];
  const escenas: EscenaPlan[] = [];

  reel.escenas.forEach((e, i) => {
    const n = i + 1;
    const desde = aFotograma(e.inicio, fps);
    const hasta = Math.min(aFotograma(e.fin, fps), total);
    const dur = hasta - desde;
    const tramo = tramoDe(e.tramo);
    if (dur <= 0) throw new Error(`Escena ${n}: el fin debe ser después del inicio`);
    if (tramo !== 'a-camara' && dur < 1.5 * fps && e.pieza !== 'Firma')
      avisos.push(`Escena ${n}: dura ${(dur / fps).toFixed(2)} s; un tramo "${tramo}" debe durar mínimo 1,5 s`);
    if (e.pieza && !PIEZAS.includes(e.pieza)) throw new Error(`Escena ${n}: pieza desconocida "${e.pieza}"`);
    if (tramo === 'a-camara' && (e.pieza || e.texto || e.insignia))
      avisos.push(`Escena ${n}: es "a cámara"; se ignora la pieza y el texto (solo fondo)`);

    const ultimo = Math.max(0, dur - 14); // nada entra en los últimos fotogramas (ahí sale)
    const rel = (t: Tiempo | undefined, def: number) => {
      const s = segundos(t, fps);
      const f = s === undefined ? def : Math.round(s * fps) - desde;
      return Math.max(0, Math.min(ultimo, f));
    };
    const momentos: number[] = [];
    const suena = (tipo: TipoSonido, f: number, ganancia = 1) => {
      sonidos.push({tipo, frame: desde + f, ganancia, escena: n});
      momentos.push(f);
    };

    const vacia = tramo === 'a-camara';
    const d: any = {...(e.datos ?? {})};
    let ultimoElemento = 0;
    const pieza = vacia ? undefined : e.pieza;

    let insignia: EscenaPlan['insignia'];
    if (!vacia && e.insignia) {
      const f = rel(e.insignia.en, 0);
      insignia = {
        numero: String(e.insignia.numero),
        etiqueta: e.insignia.etiqueta,
        puntos: e.insignia.puntos ?? 0,
        actual: e.insignia.actual ?? (Number(e.insignia.numero) || 1),
        f,
      };
      suena('clic', f, 0.8);
    }
    const base = insignia ? insignia.f + 8 : 2;

    switch (pieza) {
      case 'Chip': {
        d.f = rel(d.en, base);
        d.icono = d.icono ?? 'alerta';
        suena('pop', d.f);
        ultimoElemento = d.f;
        break;
      }
      case 'PilaChips': {
        const chips: any[] = d.chips ?? [];
        if (chips.length > 4) avisos.push(`Escena ${n}: más de 4 chips no caben con aire; usa máximo 4`);
        let prev = base - 10;
        d.chips = chips.map((c: any, k: number) => {
          const f = rel(c.en, prev + 10);
          prev = f;
          suena('pop', f);
          return {...c, f, icono: d.numerados ? 'numero' : c.icono ?? d.icono ?? 'alerta', numero: k + 1};
        });
        ultimoElemento = prev;
        break;
      }
      case 'Barra': {
        d.f = rel(d.en, base);
        d.fLleno = Math.max(d.f + 8, rel(d.llenoEn, d.f + 30));
        d.hasta = d.hasta === undefined ? 1 : d.hasta > 1 ? d.hasta / 100 : d.hasta;
        suena('trazo', d.f, 0.8);
        if (d.hasta >= 1) suena('pop', d.fLleno);
        ultimoElemento = d.fLleno;
        break;
      }
      case 'Cifra': {
        d.f = rel(d.en, base);
        if (typeof d.valor !== 'number') throw new Error(`Escena ${n}: la Cifra necesita "valor" (número dicho en el audio)`);
        d.decimales = d.decimales ?? (String(d.valor).split('.')[1]?.length ?? 0);
        for (let k = 0; k < 6; k++) suena('tic', d.f + k * 3, k === 5 ? 1 : 0.75);
        ultimoElemento = d.f + 18;
        if (d.grafica) {
          suena('trazo', d.f + 10, 0.7);
          ultimoElemento = d.f + 10 + 4 * (d.grafica.valores?.length ?? 0) + 8;
        }
        break;
      }
      case 'Grafica': {
        d.f = rel(d.en, base);
        d.tipo = d.tipo ?? 'barras';
        if (!Array.isArray(d.valores) || d.valores.length < 2) throw new Error(`Escena ${n}: la Gráfica necesita "valores" (2 o más)`);
        suena('trazo', d.f);
        ultimoElemento = d.f + 4 * d.valores.length + 12;
        break;
      }
      case 'TarjetaLogo': {
        let prev = base - 8;
        d.logos = (d.logos ?? []).map((l: any) => {
          const o = typeof l === 'string' ? {logo: l} : l;
          const f = rel(o.en, prev + 8);
          prev = f;
          suena('pop', f);
          return {...o, f};
        });
        if (d.logos.length > 3) avisos.push(`Escena ${n}: más de 3 logos a la vez; una idea por pantalla`);
        ultimoElemento = prev;
        break;
      }
      case 'IconoApp': {
        d.f = rel(d.en, base);
        suena('pop', d.f);
        ultimoElemento = d.f;
        break;
      }
      case 'Captura': {
        d.f = rel(d.en, 0);
        suena('whoosh', d.f, 0.8);
        if (d.gigante) d.gigante = {...(typeof d.gigante === 'string' ? {texto: d.gigante} : d.gigante)};
        if (d.gigante) d.gigante.f = rel(d.gigante.en, d.f + 4);
        if (d.icono) {
          d.icono = typeof d.icono === 'string' ? {logo: d.icono} : {...d.icono};
          d.icono.f = rel(d.icono.en, d.f + 10);
          suena('pop', d.icono.f, 0.8);
        }
        if (d.recuadro) {
          d.recuadro = {...d.recuadro, f: rel(d.recuadro.en, d.f + 18)};
          suena('trazo', d.recuadro.f);
        }
        if (d.marcador) {
          d.marcador = {...d.marcador, f: rel(d.marcador.en, (d.recuadro?.f ?? d.f + 18) + 12)};
          suena('trazo', d.marcador.f, 0.6);
        }
        ultimoElemento = Math.max(d.f, d.recuadro?.f ?? 0, d.marcador?.f ?? 0);
        break;
      }
      case 'Nodos': {
        d.f = rel(d.en, base);
        suena('pop', d.f, 0.8);
        let prev = d.f + 2;
        d.nodos = (d.nodos ?? []).map((x: any) => {
          const o = typeof x === 'string' ? {texto: x} : x;
          const f = rel(o.en, prev + 8);
          prev = f;
          suena('trazo', f, 0.7);
          return {...o, f};
        });
        if (d.nodos.length > 4) avisos.push(`Escena ${n}: máximo 4 nodos alrededor del centro`);
        ultimoElemento = prev + 10;
        break;
      }
      case 'Comparacion': {
        d.mal = {...d.mal};
        d.bien = {...d.bien};
        d.mal.f = rel(d.mal.en, base);
        d.fTachado = d.mal.f + 10;
        d.bien.f = Math.max(d.fTachado + 8, rel(d.bien.en, d.mal.f + 24));
        suena('whoosh', d.mal.f, 0.7);
        suena('trazo', d.fTachado, 0.8);
        suena('pop', d.bien.f);
        ultimoElemento = d.bien.f;
        break;
      }
      case 'Cta': {
        d.f = rel(d.en, base);
        d.fChip = d.f + 12;
        d.fEscribe = d.fChip + 6;
        d.palabra = String(d.palabra ?? '').toUpperCase();
        d.porLetra = 3;
        d.fEnvia = d.fEscribe + d.palabra.length * d.porLetra + 4;
        suena('pop', d.f);
        for (let l = 0; l < d.palabra.length; l++) suena('tecleo', d.fEscribe + l * d.porLetra, 0.8);
        suena('clic', d.fEnvia);
        ultimoElemento = d.fEnvia;
        break;
      }
      case 'Firma': {
        d.f = rel(d.en, 0);
        suena('trazo', d.f + 8, 0.8);
        ultimoElemento = d.f + 8;
        break;
      }
      case 'Palabras':
      case 'Buscador':
      case 'Video':
      case 'Multitud':
      case 'Clip': {
        // Todo objeto con "en" recibe "f" (fotograma relativo). Lo que ya pasó antes de la escena queda hecho (f < 0).
        const conv = (x: any): any => {
          if (Array.isArray(x)) return x.map(conv);
          if (x && typeof x === 'object') {
            const o: any = {};
            for (const [k, v] of Object.entries(x)) o[k] = conv(v);
            if (x.en !== undefined) {
              const sx = segundos(x.en, fps)!;
              o.f = Math.round(sx * fps) - desde < 0 ? -999 : rel(x.en, 0);
              const tipo: TipoSonido | null = x.sonido === 'ninguno' ? null : x.sonido ?? (pieza === 'Palabras' ? (x.golpe ? 'golpe' : 'whoosh') : 'pop');
              if (o.f >= 0 && tipo) suena(tipo, o.f, x.ganancia ?? (tipo === 'whoosh' ? 0.55 : 0.85));
              ultimoElemento = Math.max(ultimoElemento, o.f);
            }
            return o;
          }
          return x;
        };
        Object.assign(d, conv(d));
        if (pieza === 'Palabras') {
          for (const l of d.palabras ?? []) if (l.tachar !== undefined) {
            l.fTachar = rel(l.tachar, 0);
            suena('trazo', l.fTachar, 0.9);
          }
        }
        break;
      }
      default:
        break;
    }

    let texto = vacia ? undefined : e.texto;
    let textoF = 0;
    if (texto) {
      textoF = rel(e.textoEn, pieza && pieza !== 'Texto' ? ultimoElemento + 8 : base);
      momentos.push(textoF);
      const plano = partesTexto(texto).map((p) => p.t).join('');
      const palabras = contarPalabras(plano);
      if (palabras < 2 || palabras > 6) avisos.push(`Escena ${n}: el texto de apoyo tiene ${palabras} palabras (debe tener de 2 a 6)`);
      if (/[.]\s*$/.test(plano)) avisos.push(`Escena ${n}: el texto termina en punto; quítalo`);
      const acento = partesTexto(texto).filter((p) => p.estilo !== 'normal').reduce((a, p) => a + contarPalabras(p.t), 0);
      if (acento > 3) avisos.push(`Escena ${n}: ${acento} palabras de acento (máximo 3)`);
    }
    if (!vacia && !pieza && !texto) avisos.push(`Escena ${n}: tramo "${tramo}" sin pieza ni texto; usa "a-camara"`);
    if (pieza === 'Texto' && !texto) avisos.push(`Escena ${n}: la pieza Texto necesita "texto"`);

    const destello = !vacia && !!e.destello;
    if (destello) suena('whoosh', 0, 0.9);
    if (!vacia && pieza !== 'Captura' && pieza !== 'Comparacion' && !destello && (i === 0 || reel.escenas[i - 1].tramo !== e.tramo))
      suena('whoosh', 0, 0.45); // entrada suave cuando cambia el tipo de tramo

    escenas.push({i: n, desde, hasta, dur, tramo, pieza, texto, textoF, insignia, destello, oscuro: !vacia && e.fondo === 'oscuro', d, momentos: [...new Set(momentos)].sort((a, b) => a - b), nota: e.nota});
  });

  // orden, cruces y ritmo
  escenas.forEach((e, k) => {
    const prev = escenas[k - 1];
    if (prev && e.desde < prev.hasta) avisos.push(`Escena ${e.i}: se monta sobre la escena ${prev.i}; deben ir una detrás de otra`);
    if (e.tramo === 'a-camara' && e.dur > 4 * fps) avisos.push(`Escena ${e.i}: Juan Pablo solo ${(e.dur / fps).toFixed(1)} s (máximo 4 s seguidos sin gráfico)`);
  });
  const destellos = escenas.filter((e) => e.destello);
  destellos.forEach((e, k) => {
    if (k > 0 && e.desde - destellos[k - 1].desde < 12 * fps)
      avisos.push(`Escena ${e.i}: destello a menos de 12 s del anterior`);
  });
  const ult = escenas[escenas.length - 1];
  if (ult && ult.hasta < total) avisos.push(`Las escenas terminan en ${formato(ult.hasta, fps)} y el reel dura ${formato(total, fps)}: el final queda en fondo limpio`);
  if (!escenas.some((e) => e.pieza === 'Firma')) avisos.push('El reel no cierra con la Firma JPR (1 s)');

  sonidos.sort((a, b) => a.frame - b.frame);
  const m = reel.musica;
  const musica = m && {
    bpm: m.bpm ?? 100,
    golpes: (m.golpes ?? []).map((t) => segundos(t, fps)!),
    pausas: (m.pausas ?? []).map(([a, b]) => [segundos(a, fps)!, segundos(b, fps)!] as [number, number]),
    final: segundos(m.final, fps),
  };
  return {nombre: reel.nombre, fps, total, escenas, sonidos, avisos, musica};
};

export const resumenTramos = (plan: Plan) => {
  const r = {mitad: 0, completa: 0, 'a-camara': 0} as Record<Tramo, number>;
  plan.escenas.forEach((e) => (r[e.tramo] += e.dur));
  const libre = plan.total - plan.escenas.reduce((a, e) => a + e.dur, 0);
  r['a-camara'] += Math.max(0, libre);
  return r;
};
