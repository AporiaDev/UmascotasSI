import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-2xl transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#4ADE80] text-white hover:bg-[#22C55E] active:scale-95 focus:ring-[#4ADE80]/30 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-[#22C55E] border-2 border-[#4ADE80] hover:bg-[#D1FAE5] active:scale-95 focus:ring-[#4ADE80]/30',
    ghost: 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30 active:scale-95 border border-white/30',
    outline: 'bg-transparent text-[#22C55E] border-2 border-[#4ADE80] hover:bg-[#4ADE80] hover:text-white active:scale-95',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
    '2xl': 'px-12 py-6 text-2xl',
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

