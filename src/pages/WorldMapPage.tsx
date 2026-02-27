import Layout from '../components/Layout.tsx';
import FloorCard from '../components/FloorCard.tsx';
import { getFloorsByGrade } from '../data/floors.ts';
import type { Grade } from '../data/types.ts';

interface WorldMapPageProps {
  grade: Grade;
  clearedFloors: number[];
  onSelectFloor: (floorId: number) => void;
  onBack: () => void;
}

export default function WorldMapPage({
  grade,
  clearedFloors,
  onSelectFloor,
  onBack,
}: WorldMapPageProps) {
  const floors = getFloorsByGrade(grade);

  // Unlock logic: first floor of the grade is always unlocked, others require previous floor cleared
  const isUnlocked = (floorId: number, index: number): boolean => {
    if (index === 0) return true;
    const prevFloor = floors[index - 1];
    return clearedFloors.includes(prevFloor.id);
  };

  const title = grade === 1 ? '小1 ワールドマップ' : '小4 ワールドマップ';

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
        {floors.map((floor, index) => (
          <FloorCard
            key={floor.id}
            floor={{ ...floor, unlocked: isUnlocked(floor.id, index) }}
            cleared={clearedFloors.includes(floor.id)}
            onSelect={() => onSelectFloor(floor.id)}
          />
        ))}
      </div>
    </Layout>
  );
}
