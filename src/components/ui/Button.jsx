import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '',
  disabled = false,
  onClick,
  fullWidth = false,
  size = 'md'
}) => {
  const baseStyles = 'font-medium rounded-md transition duration-300 focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50',
    secondary: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50',
    outline: 'bg-transparent border border-teal-600 text-teal-600 hover:bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50',
    ghost: 'bg-transparent text-teal-600 hover:bg-teal-50 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50',
  };
  
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;