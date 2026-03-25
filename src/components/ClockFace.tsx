interface ClockFaceProps {
  hour: number;
  minute: number;
  size?: number;
}

export default function ClockFace({ hour, minute, size = 140 }: ClockFaceProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;

  // Angles (0° = 12 o'clock, clockwise)
  const minuteAngle = (minute / 60) * 360;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

  const handEnd = (angle: number, length: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * length,
      y: cy + Math.sin(rad) * length,
    };
  };

  const minuteHand = handEnd(minuteAngle, r * 0.78);
  const hourHand = handEnd(hourAngle, r * 0.55);

  // Number positions
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const num = i === 0 ? 12 : i;
    const angle = (i / 12) * 360;
    const pos = handEnd(angle, r * 0.78);
    return { num, ...pos };
  });

  // Tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 360;
    const isMajor = i % 5 === 0;
    const inner = handEnd(angle, r * (isMajor ? 0.88 : 0.93));
    const outer = handEnd(angle, r * 0.97);
    return { inner, outer, isMajor };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Clock face */}
      <circle cx={cx} cy={cy} r={r} fill="#FFFEF5" stroke="#5C4033" strokeWidth={3} />

      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={r * 0.95} fill="none" stroke="#E8E0D0" strokeWidth={1} />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.inner.x} y1={t.inner.y}
          x2={t.outer.x} y2={t.outer.y}
          stroke={t.isMajor ? '#5C4033' : '#C0B0A0'}
          strokeWidth={t.isMajor ? 2 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* Numbers */}
      {numbers.map(n => (
        <text
          key={n.num}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size * 0.1}
          fontWeight={700}
          fontFamily="'Zen Maru Gothic', sans-serif"
          fill="#5C4033"
        >
          {n.num}
        </text>
      ))}

      {/* Hour hand (thick, short) */}
      <line
        x1={cx} y1={cy}
        x2={hourHand.x} y2={hourHand.y}
        stroke="#333"
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Minute hand (thin, long) */}
      <line
        x1={cx} y1={cy}
        x2={minuteHand.x} y2={minuteHand.y}
        stroke="#6C63FF"
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={4} fill="#333" />
      <circle cx={cx} cy={cy} r={2} fill="#FF6B6B" />
    </svg>
  );
}
