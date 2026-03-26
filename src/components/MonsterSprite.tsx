import { useRef, useEffect } from 'react';

interface MonsterSpriteProps {
  emoji: string;
  name: string;
  phase: 'appear' | 'idle' | 'hit' | 'defeat';
  spritePath?: string;
  spriteFrames?: number;
}

export default function MonsterSprite({ emoji, name, phase, spritePath, spriteFrames = 8 }: MonsterSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load and animate sprite sheet
  useEffect(() => {
    if (!spritePath) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = spritePath;
    imgRef.current = img;

    img.onload = () => {
      const frameW = img.width / spriteFrames;
      const frameH = img.height;
      canvas.width = frameW;
      canvas.height = frameH;

      const ctx = canvas.getContext('2d')!;
      let tick = 0;

      const animate = () => {
        tick++;
        if (tick % 8 === 0) {
          frameRef.current = (frameRef.current + 1) % spriteFrames;
        }
        ctx.clearRect(0, 0, frameW, frameH);
        ctx.drawImage(img, frameRef.current * frameW, 0, frameW, frameH, 0, 0, frameW, frameH);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    };

    return () => cancelAnimationFrame(animRef.current);
  }, [spritePath, spriteFrames]);

  const animStyle = (): React.CSSProperties => {
    switch (phase) {
      case 'appear': return { animation: 'monsterAppear 0.6s ease forwards' };
      case 'hit': return { animation: 'shakeHit 0.5s ease' };
      case 'defeat': return { animation: 'monsterDefeat 0.8s ease forwards' };
      default: return { animation: 'pulse 2s ease infinite' };
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      ...animStyle(),
    }}>
      {spritePath ? (
        <canvas
          ref={canvasRef}
          style={{
            width: 96,
            height: 96,
            imageRendering: 'pixelated',
          }}
        />
      ) : (
        <div style={{ fontSize: 80, lineHeight: 1 }}>{emoji}</div>
      )}
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
        {name}
      </div>
    </div>
  );
}
