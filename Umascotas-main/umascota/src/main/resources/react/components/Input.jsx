import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-gray-50 border-2 border-gray-200
          text-gray-900 placeholder-gray-400
          transition-all duration-300
          focus:outline-none focus:border-[#4ADE80] focus:bg-white
          focus:ring-4 focus:ring-[#4ADE80]/20
          ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;

