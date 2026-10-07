/** Flamme démoniaque FlambHub — logo esport, noir & bleu uniquement.
 * Silhouette de flamme d'après OpenMoji « fire » (CC BY-SA 4.0),
 * recolorée et masquée pour FlambHub. */

export const FLAME_OUTLINE =
  "M51.3344,58.3018c7.563-9.7894,4.0318-21.8721,2.4461-25.5688c-0.1799-0.4193-0.9302-0.5566-0.982-0.1006 c-0.1225,1.0797-0.4061,2.3611-2.0041,1.9736c-0.8203-0.1989-1.3479-0.556-1.3479-1.8802 c0.511-15.0494-10.5109-25.2968-14.3463-28.5356c-0.5103-0.4309-1.2668,0.0293-1.1587,0.7039 c2.456,15.3348-1.6079,14.2846-3.0986,13.8192c-0.2593-0.081-0.5408,0.0546-0.6603,0.3074 c-4.5882,9.7014-3.4112,14.2653-3.519,17.4455c0,0.2569,0,0.687,0,0.9581c0,1.746-1.4154,2.5822-2.5607,2.0714 c-2.0545-0.9163-2.4047-6.3729-2.4134-7.8235c-0.0041-0.6828-0.8094-0.8791-1.202-0.332 c-8.8048,12.267-2.3251,23.1974-0.0822,26.3171c0.6459,0.8984,0.9025,2.0748,0.5354,3.1298 c-0.0412,0.1183-0.0896,0.2352-0.1465,0.349c-0.3988,0.7981,0.6707,1.4,0.6707,1.4c1.3155,1.2339,5.4651,5.1806,14.2817,5.1805 c7.1344-0.0001,11.9478-3.0595,13.8297-4.7247c0.8829-0.7812,1.2761-0.8594,1.2732-1.6827 C50.8459,60.3243,50.8238,58.8066,51.3344,58.3018";

const FLAME_TRANSFORM = "translate(3.2 3.2) scale(1.3)";
const FLAME_INSET = "translate(36 34) scale(0.9) translate(-36 -34)";

const SEPARATIONS = ["M 41 84 Q 40 78 38 74", "M 59 84 Q 60 78 62 74"];

const CYAN_ACCENTS = [
  "M 27 62 Q 29 50 32 42",
  "M 73 62 Q 71 50 68 42",
  "M 44 30 Q 46 36 48 40",
  "M 56 30 Q 54 36 52 40",
];

const EYE_LEFT = "38 48, 48 46, 49 50, 39 52.5";
const EYE_RIGHT = "62 48, 52 46, 51 50, 61 52.5";
const BROW_LEFT = "40 41, 48 46.5, 49 50.5, 39.5 44.5";
const BROW_RIGHT = "60 41, 52 46.5, 51 50.5, 60.5 44.5";

const NOSE_BLACK = "M 47.5 52 L 50 56 L 52.5 52";
const NOSE_CYAN = "M 50 56 Q 53 58 56 59";
const MOUTH = "M 41 64 Q 50 70 59 63";

export function FlameDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00C8FF" />
        <stop offset="30%" stopColor="#006CFF" />
        <stop offset="65%" stopColor="#003BFF" />
        <stop offset="100%" stopColor="#071A45" />
      </linearGradient>
      <linearGradient id={`${id}-cyan`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00C8FF" />
        <stop offset="100%" stopColor="#006CFF" />
      </linearGradient>
      <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,200,255,0.35)" />
        <stop offset="100%" stopColor="rgba(0,200,255,0)" />
      </radialGradient>
    </defs>
  );
}

export function FlameGroup({
  id,
  cx = 50,
  cy = 50,
  scale = 1,
}: {
  id: string;
  cx?: number;
  cy?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${cx - 50 * scale} ${cy - 50 * scale}) scale(${scale})`}>
      <g transform={FLAME_TRANSFORM}>
        <path d={FLAME_OUTLINE} fill={`url(#${id}-rim)`} />
        <path d={FLAME_OUTLINE} fill="#050505" transform={FLAME_INSET} />
      </g>
      <g fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round">
        {SEPARATIONS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="#00C8FF" strokeWidth="1" opacity="0.7">
        {CYAN_ACCENTS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="#00C8FF" strokeWidth="2.5" opacity="0.5" strokeLinejoin="round">
        <polygon points={EYE_LEFT} />
        <polygon points={EYE_RIGHT} />
      </g>
      <g fill={`url(#${id}-cyan)`} stroke="#00C8FF" strokeWidth="0.6" strokeLinejoin="round">
        <polygon points={EYE_LEFT} />
        <polygon points={EYE_RIGHT} />
      </g>
      <g fill="#000000" stroke="#006CFF" strokeWidth="1.4" opacity="0.95" strokeLinejoin="round">
        <polygon points={BROW_LEFT} />
        <polygon points={BROW_RIGHT} />
      </g>
      <path
        d={NOSE_BLACK}
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d={NOSE_CYAN} fill="none" stroke="#00C8FF" strokeWidth="1" opacity="0.55" />
      <path
        d={MOUTH}
        fill="none"
        stroke="#00C8FF"
        strokeWidth="5"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d={MOUTH}
        fill="none"
        stroke={`url(#${id}-cyan)`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </g>
  );
}

export function FlameHalo({
  id,
  cx,
  cy,
  r,
}: {
  id: string;
  cx: number;
  cy: number;
  r: number;
}) {
  return <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-halo)`} />;
}

export function flameDefsMarkup(id: string): string {
  return `<defs>
<linearGradient id="${id}-rim" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#00C8FF"/>
<stop offset="30%" stop-color="#006CFF"/>
<stop offset="65%" stop-color="#003BFF"/>
<stop offset="100%" stop-color="#071A45"/>
</linearGradient>
<linearGradient id="${id}-cyan" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#00C8FF"/>
<stop offset="100%" stop-color="#006CFF"/>
</linearGradient>
<radialGradient id="${id}-halo" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="rgba(0,200,255,0.35)"/>
<stop offset="100%" stop-color="rgba(0,200,255,0)"/>
</radialGradient>
</defs>`;
}

export function flameGroupMarkup(
  id: string,
  cx: number,
  cy: number,
  scale: number,
): string {
  const separations = SEPARATIONS.map((d) => `<path d="${d}"/>`).join("\n");
  const accents = CYAN_ACCENTS.map((d) => `<path d="${d}"/>`).join("\n");
  return `<g transform="translate(${cx - 50 * scale} ${cy - 50 * scale}) scale(${scale})">
<g transform="${FLAME_TRANSFORM}">
<path d="${FLAME_OUTLINE}" fill="url(#${id}-rim)"/>
<path d="${FLAME_OUTLINE}" fill="#050505" transform="${FLAME_INSET}"/>
</g>
<g fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round">
${separations}
</g>
<g fill="none" stroke="#00C8FF" stroke-width="1" opacity="0.7">
${accents}
</g>
<g fill="none" stroke="#00C8FF" stroke-width="2.5" opacity="0.5" stroke-linejoin="round">
<polygon points="${EYE_LEFT}"/>
<polygon points="${EYE_RIGHT}"/>
</g>
<g fill="url(#${id}-cyan)" stroke="#00C8FF" stroke-width="0.6" stroke-linejoin="round">
<polygon points="${EYE_LEFT}"/>
<polygon points="${EYE_RIGHT}"/>
</g>
<g fill="#000000" stroke="#006CFF" stroke-width="1.4" opacity="0.95" stroke-linejoin="round">
<polygon points="${BROW_LEFT}"/>
<polygon points="${BROW_RIGHT}"/>
</g>
<path d="${NOSE_BLACK}" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${NOSE_CYAN}" fill="none" stroke="#00C8FF" stroke-width="1" opacity="0.55"/>
<path d="${MOUTH}" fill="none" stroke="#00C8FF" stroke-width="5" opacity="0.3" stroke-linecap="round"/>
<path d="${MOUTH}" fill="none" stroke="url(#${id}-cyan)" stroke-width="2.4" stroke-linecap="round"/>
</g>`;
}
