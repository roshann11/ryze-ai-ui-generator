import React from 'react';
import { InputProps } from '@/types/components';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  label,
  value,
  onChange,
  disabled = false,
  error,
  fullWidth = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-300 focus:ring-primary-500';

  return (
    <div className={widthStyle}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errorStyle} ${widthStyle} disabled:bg-neutral-100 disabled:cursor-not-allowed`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};