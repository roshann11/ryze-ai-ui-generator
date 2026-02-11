import React from 'react';
import { CardProps } from '@/types/components';

export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  variant = 'default',
  padding = 'md',
}) => {
  const variantStyles = {
    default: 'bg-white border border-neutral-200',
    bordered: 'bg-white border-2 border-neutral-300',
    elevated: 'bg-white shadow-lg',
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]}`}>
      {title && (
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-neutral-600 mb-4">
          {description}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
};