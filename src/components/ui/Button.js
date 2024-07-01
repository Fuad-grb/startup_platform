import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 hover:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
