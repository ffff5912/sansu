import Layout from '../components/Layout.tsx';
import FloorCard from '../components/FloorCard.tsx';
import { getFloorsByGrade } from '../data/floors.ts';
import type { Grade, GameDifficulty } from '../data/types.ts';

interface WorldMapPageProps {
  grade: Grade;
  clearedFloors: number[];
  difficulty: GameDifficulty;
  onSetDifficulty: (diff: GameDifficulty) => void;
  onSelectFloor: (floorId: number) => void;
  onBack: () => void;
}

export default function WorldMapPage({
  grade,
  clearedFloors,
  difficulty,
  onSetDifficulty,
  onSelectFloor,
  onBack,
}: WorldMapPageProps) {
  const floors = getFloorsByGrade(grade);

  const title = grade === 1 ? '小1 ワールドマップ' : '小4 ワールドマップ';

  const diffBtnStyle = (d: GameDifficulty): React.CSSProperties => ({
    padding: '6px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
    border: difficulty === d ? '2px solid' : '2px solid var(--color-bg-lighter)',
    background: difficulty === d
      ? d === 'normal' ? '#e8f5e9' : '#fff3e0'
      : 'var(--color-surface)',
    color: difficulty === d
      ? d === 'normal' ? '#2e7d32' : '#e65100'
      : 'var(--color-text-dim)',
    borderColor: difficulty === d
      ? d === 'normal' ? '#66bb6a' : '#ff9800'
      : 'var(--color-bg-lighter)',
  });

  return (
    <Layout title={title} onBack={onBack}>
      <div style={{
        height: '100%',
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        animation: 'fadeIn 0.3s ease',
      }}>
        {/* Difficulty toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '8px 0',
        }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-dim)', marginRight: 4 }}>
            なんいど：
          </span>
          <button style={diffBtnStyle('normal')} onClick={() => onSetDifficulty('normal')}>
            ふつう
          </button>
          <button style={diffBtnStyle('hard')} onClick={() => onSetDifficulty('hard')}>
            むずかしい 🔥
          </button>
        </div>

        {floors.map((floor) => (
          <FloorCard
            key={floor.id}
            floor={{ ...floor, unlocked: true }}
            cleared={clearedFloors.includes(floor.id)}
            onSelect={() => onSelectFloor(floor.id)}
          />
        ))}
      </div>
    </Layout>
  );
}
