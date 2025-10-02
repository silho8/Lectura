import React from 'react';

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block font-pixel text-lg text-primary mb-2 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-base-200 text-text-light font-sans
                   border-2 border-base-300
                   focus:outline-none focus:border-primary
                   placeholder:text-base-300"
      />
    </div>
  );
};

export default FormInput;