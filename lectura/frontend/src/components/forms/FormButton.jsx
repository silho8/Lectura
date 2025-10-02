import React from 'react';

const FormButton = ({ children, type = 'submit', isLoading = false, fullWidth = true, variant = 'primary' }) => {
  const baseClasses = `
    ${fullWidth ? 'w-full' : 'px-8'}
    py-3 font-pixel uppercase tracking-wider text-lg
    border-2 border-text-dark
    transition-all duration-150 ease-out
    focus:outline-none
  `;

  const variantClasses = {
    primary: `
      bg-base-200 text-primary
      shadow-pixel-sm-primary
      hover:bg-primary hover:text-text-dark hover:shadow-pixel-sm-secondary
      active:translate-y-1 active:shadow-none
    `,
    secondary: `
      bg-base-200 text-secondary
      shadow-pixel-sm-secondary
      hover:bg-secondary hover:text-text-dark hover:shadow-pixel-sm-primary
      active:translate-y-1 active:shadow-none
    `,
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      disabled={isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${isLoading ? disabledClasses : 'hover:-translate-y-1'}
      `}
    >
      {isLoading ? (
        <span className="animate-pulse">Processing...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default FormButton;