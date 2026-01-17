'use client';
import { useTransition } from './TransitionProvider';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export default function TransitionLink({ href, children, className, onClick, ...props }: Props) {
  const { animatePageOut } = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    // LE PLUS IMPORTANT : Empêcher le comportement par défaut
    e.preventDefault();
    console.log("TransitionLink: Click intercepté sur", href);
    
    if (onClick) onClick();

    // Lancer l'animation
    animatePageOut(href);
  };

  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}