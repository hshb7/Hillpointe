import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = clsx(
    'w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-200',
    {
      'border-red-300 focus:ring-red-500': error,
      'border-gray-300 hover:border-gray-400': !error,
      'pl-10': leftIcon,
      'pr-10': rightIcon,
    },
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
};

export default Input;