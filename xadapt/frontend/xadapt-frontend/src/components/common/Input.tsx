import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  fullWidth = true,
  className = '',
  value,
  ...props
}) => {
  const hasValue = value && value.toString().length > 0;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <div className="relative group">
        {label && (
          <label
            className={`
              absolute left-4 top-1/2 -translate-y-1/2
              text-gray-500 pointer-events-none
              transition-all duration-300 origin-left
              group-focus-within:-translate-y-9 group-focus-within:text-xs group-focus-within:text-primary
              ${icon ? 'left-12' : 'left-4'}
              ${hasValue ? '-translate-y-9 text-xs text-primary' : ''}
            `}
          >
            {label}
          </label>
        )}

        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}

        <input
          {...props}
          value={value}
          className={`
            w-full px-5 pt-7 pb-4 rounded-2xl
            bg-white/80 backdrop-blur-xl
            border border-white/50
            text-teal-900 placeholder-transparent
            focus:outline-none focus:border-primary focus:shadow-focus-glow
            transition-all duration-300
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:shadow-none' : ''}
            ${className}
          `}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-poppins font-500">
          <span>✕</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;