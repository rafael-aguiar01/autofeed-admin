import React from 'react';

const TextinputRegister = ({ name, label, type, register, error, value, onChange, className }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        {...(register && register(name))}
        value={value}
        onChange={onChange}
        className={`form-control ${className}`}
      />
      {error && <span className="text-red-500">{error.message}</span>}
    </div>
  );
};

export default TextinputRegister;