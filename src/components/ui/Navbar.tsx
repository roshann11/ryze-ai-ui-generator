import React from 'react';
import { NavbarProps } from '@/types/components';

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  children,
  variant = 'light',
}) => {
  const variantStyles = {
    light: 'bg-white border-b border-neutral-200 text-neutral-900',
    dark: 'bg-neutral-900 text-white',
  };

  return (
    <nav className={`px-6 py-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {brand && (
          <div className="text-xl font-bold">
            {brand}
          </div>
        )}
        <div className="flex items-center gap-4">
          {children}
        </div>
      </div>
    </nav>
  );
};