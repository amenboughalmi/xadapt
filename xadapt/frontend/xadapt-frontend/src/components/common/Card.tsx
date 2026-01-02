import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  hoverable = false,
  icon,
}) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl
        bg-white/75 backdrop-blur-2xl
        border border-white/50
        shadow-card-float
        transition-all duration-700
        hover:shadow-card-premium hover:-translate-y-2
        before:absolute before:inset-0 before:rounded-3xl
        before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-teal-900/5
        before:opacity-0 hover:before:opacity-100 before:transition-opacity
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Inner glow border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/30 pointer-events-none" />

      <div className="relative z-10 p-8">
        {(title || icon) && (
          <div className="flex items-center gap-4 mb-6">
            {icon && (
              <div className="p-3 rounded-2xl bg-gradient-primary/10 backdrop-blur-md">
                <span className="text-primary">{icon}</span>
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-2xl font-poppins font-800 text-teal-900 tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 font-poppins font-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <div className={title || icon ? 'pt-4' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;