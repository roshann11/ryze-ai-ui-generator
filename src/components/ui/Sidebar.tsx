import React from 'react';
import { SidebarProps } from '@/types/components';

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  width = 'md',
  position = 'left',
  isOpen = true,
}) => {
  const widthStyles = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  const positionStyles = position === 'left' ? 'left-0' : 'right-0';

  if (!isOpen) return null;

  return (
    <aside className={`fixed top-0 ${positionStyles} h-full bg-white border-r border-neutral-200 ${widthStyles[width]} overflow-y-auto`}>
      <div className="p-6">
        {children}
      </div>
    </aside>
  );
};