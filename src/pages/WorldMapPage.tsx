import Layout from '../components/Layout.tsx';
import FloorCard from '../components/FloorCard.tsx';
import { FLOORS } from '../data/floors.ts';

interface WorldMapPageProps {
  clearedFloors: number[];
  onSelectFloor: (floorId: number) => void;
  onBack: () => void;
}

export default function WorldMapPage({
  clearedFloors,
  onSelectFloor,
  onBack,
}: WorldMapPageProps) {
  // Unlock logic: floor is accessible if previous floor is cleared, or it's floor 1
  const isUnlocked = (floorId: number): boolean => {
    if (floorId === 1) return true;
    return clearedFloors.includes(floorId - 1);
  };

  return (
    <Layout title="ワールドマップ" onBack={onBack}>
      <div style={{
        height: '100%',
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        animation: 'fadeIn 0.3s ease',
      }}>
        {FLOORS.map(floor => (
          <FloorCard
            key={floor.id}
            floor={{ ...floor, unlocked: isUnlocked(floor.id) }}
            cleared={clearedFloors.includes(floor.id)}
            onSelect={() => onSelectFloor(floor.id)}
          />
        ))}
      </div>
    </Layout>
  );
}
