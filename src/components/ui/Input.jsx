import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  id, 
  type = 'text', 
  placeholder = '', 
  error = '', 
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;