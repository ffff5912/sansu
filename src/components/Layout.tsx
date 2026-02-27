import type { ReactNode } from 'react';

interface LayoutProps {
  title?: string;
  children: ReactNode;
  onBack?: () => void;
}

export default function Layout({ title, children, onBack }: LayoutProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {title && (
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--color-surface)',
          borderBottom: '2px solid var(--color-bg-light)',
          minHeight: 44,
          flexShrink: 0,
        }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                fontSize: 20,
                padding: '4px 8px',
                color: 'var(--color-text-dim)',
              }}
            >
              ←
            </button>
          )}
          <h1 style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-text-accent)',
          }}>
            {title}
          </h1>
        </header>
      )}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </main>
    </div>
  );
}
