import React from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = `
    relative overflow-hidden font-poppins font-600
    flex items-center justify-center gap-3
    rounded-2xl transition-all duration-300
    active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    hover:-translate-y-1 hover:shadow-button-lift
    after:absolute after:inset-0 after:bg-white/20
    after:opacity-0 hover:after:opacity-100 after:transition-opacity
  `;

  const variantClasses = {
    primary: 'bg-gradient-primary text-white shadow-glow-lg',
    secondary: 'bg-teal-900 text-white shadow-glow',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    outline: 'border-2 border-primary text-primary bg-white/90 hover:bg-primary/5',
    glass: 'bg-white/20 backdrop-blur-xl border border-white/40 text-primary hover:bg-white/30',
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-3">
        {isLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && !isLoading && icon}
        <span>{children}</span>
      </span>
    </button>
  );
};

export default Button;