import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  className = '',
  type = 'button', // Default to button to prevent form submit in non-form contexts
  ...props 
}) => {
  const baseStyle = "rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 select-none";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3",
    lg: "px-6 py-4 text-lg"
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:bg-blue-800",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 active:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 active:bg-green-700",
    outline: "border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
  };

  return (
    <button 
      type={type}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};