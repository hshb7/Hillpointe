import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = clsx(
    'bg-white rounded-xl border border-gray-200 shadow-sm',
    paddingClasses[padding],
    {
      'cursor-pointer': onClick,
    },
    className
  );

  const MotionDiv = onClick ? motion.div : motion.div;

  return (
    <MotionDiv
      className={cardClasses}
      onClick={onClick}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </MotionDiv>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={clsx('mb-4 pb-4 border-b border-gray-200', className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={className}>
    {children}
  </div>
);

export default Card;