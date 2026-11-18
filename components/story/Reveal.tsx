import type { ReactNode, CSSProperties } from 'react';

// Élément dont l'opacité suit une fenêtre de progression de son chapitre.
// La boucle de scroll (app/page.tsx) lit data-w="début,fin" et anime opacity/transform.
export default function Reveal({
  w,
  children,
  className = '',
  style,
  as: Tag = 'div',
}: {
  w: [number, number];
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'p' | 'h2' | 'span';
}) {
  return (
    <Tag data-w={`${w[0]},${w[1]}`} className={`will-change-transform ${className}`} style={{ opacity: 0, ...style }}>
      {children}
    </Tag>
  );
}
