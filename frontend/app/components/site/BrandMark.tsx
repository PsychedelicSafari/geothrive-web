const project = (x: number, y: number, height = 0): string =>
  `${(100 + 0.82 * x - 0.82 * y).toFixed(2)},${(112 + 0.38 * x + 0.38 * y - height).toFixed(2)}`;

const polygon = (sides: number, radius: number, rotation: number, height = 0): string =>
  Array.from({ length: sides }, (_, i) => {
    const angle = rotation + (i * Math.PI * 2) / sides;
    return project(Math.cos(angle) * radius, Math.sin(angle) * radius, height);
  }).join(' ');

export default function BrandMark({
  idPrefix,
  className = '',
}: {
  idPrefix: string;
  className?: string;
}): React.ReactElement {
  return (
    <svg className={className} viewBox="0 0 200 190" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={`${idPrefix}-gold`}
          x1="20"
          y1="30"
          x2="170"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff0bc" />
          <stop offset=".45" stopColor="#f2bd69" />
          <stop offset="1" stopColor="#b36b7b" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-depth`}
          x1="20"
          y1="100"
          x2="180"
          y2="165"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c24bab" />
          <stop offset=".5" stopColor="#67368c" />
          <stop offset="1" stopColor="#2e1549" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-glass`}
          x1="30"
          y1="70"
          x2="170"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9e62ce" stopOpacity=".75" />
          <stop offset="1" stopColor="#3a195d" stopOpacity=".9" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="154" rx="82" ry="22" fill="#10071d" opacity=".55" />
      <polygon
        points={polygon(6, 73, Math.PI / 6, -14)}
        fill={`url(#${idPrefix}-depth)`}
        stroke="#c47ac5"
        strokeWidth="1.2"
      />
      <polygon
        points={polygon(6, 73, Math.PI / 6)}
        fill={`url(#${idPrefix}-glass)`}
        stroke={`url(#${idPrefix}-gold)`}
        strokeWidth="1.8"
      />
      {[
        [-34, 0],
        [0, 0],
        [34, 0],
        [-17, 29],
        [17, 29],
        [-17, -29],
        [17, -29],
      ].map(([x, y]) => (
        <polygon
          key={`${x}-${y}`}
          points={Array.from({ length: 6 }, (_, i) => {
            const a = (i * Math.PI) / 3;
            return project(x + Math.cos(a) * 18, y + Math.sin(a) * 18, 1);
          }).join(' ')}
          stroke="#d5a3e0"
          strokeWidth=".65"
          opacity=".6"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const radius = 70 - i * 6.7;
        const rotation = i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;
        return (
          <g key={i}>
            <polygon
              points={polygon(3, radius, rotation, i * 3.5 - 5)}
              fill={`url(#${idPrefix}-depth)`}
              stroke="#8b4b97"
              strokeWidth="1"
            />
            <polygon
              points={polygon(3, radius, rotation, i * 3.5 + 2)}
              fill={`url(#${idPrefix}-gold)`}
              fillOpacity=".12"
              stroke={`url(#${idPrefix}-gold)`}
              strokeWidth={i > 5 ? 1.5 : 1.1}
            />
          </g>
        );
      })}
      <path d="m100 50 11 24-11-5-11 5Z" fill={`url(#${idPrefix}-gold)`} />
      <circle cx="100" cy="49" r="3" fill="#fff2cd" />
    </svg>
  );
}
