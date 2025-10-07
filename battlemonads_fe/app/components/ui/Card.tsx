import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  variant?: 'default' | 'eth' | 'btc';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  variant = 'default',
  onClick,
}) => {
  const glowStyles = {
    default: 'hover:shadow-[0_0_20px_rgba(90,216,204,0.3)]',
    eth: 'hover:shadow-[0_0_30px_rgba(98,126,234,0.6)]',
    btc: 'hover:shadow-[0_0_30px_rgba(247,147,26,0.6)]',
  };

  return (
    <div
      className={`
        bg-[#1e2429]
        border border-[#2A3238]
        rounded-xl
        p-4
        transition-all
        duration-300
        ${glow ? glowStyles[variant] : ''}
        ${onClick ? 'cursor-pointer hover:bg-[#242b31]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};