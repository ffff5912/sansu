import type { Direction } from '../data/types.ts';

interface DPadProps {
  onDirection: (dir: Direction) => void;
}

const btnStyle = (gridArea: string): React.CSSProperties => ({
  gridArea,
  width: 56,
  height: 56,
  borderRadius: 12,
  background: 'var(--color-bg-light)',
  border: '2px solid var(--color-primary)',
  color: 'var(--color-primary)',
  fontSize: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'manipulation',
  userSelect: 'none',
});

export default function DPad({ onDirection }: DPadProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateAreas: `
        ". up ."
        "left . right"
        ". down ."
      `,
      gridTemplateColumns: '56px 56px 56px',
      gridTemplateRows: '56px 56px 56px',
      gap: 4,
      justifyContent: 'center',
      padding: '8px 0',
    }}>
      <button style={btnStyle('up')} onClick={() => onDirection('up')}>▲</button>
      <button style={btnStyle('left')} onClick={() => onDirection('left')}>◀</button>
      <button style={btnStyle('right')} onClick={() => onDirection('right')}>▶</button>
      <button style={btnStyle('down')} onClick={() => onDirection('down')}>▼</button>
    </div>
  );
}
