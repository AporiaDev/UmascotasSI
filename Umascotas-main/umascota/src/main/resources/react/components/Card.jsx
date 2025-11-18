import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'rounded-3xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white shadow-lg hover:shadow-xl',
    glass: 'glass-strong shadow-xl hover:shadow-2xl',
    'glass-green': 'glass-green shadow-xl hover:shadow-2xl',
    elevated: 'bg-white shadow-2xl hover:shadow-3xl',
  };
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

