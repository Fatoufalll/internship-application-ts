import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, placeholder, value, onChange, error }) => {
  return (
    <div>
      <label className="block font-semibold mb-1" htmlFor={id}>{label}</label>
      <input
        required
        id={id}
        className={`border p-2 rounded ${error ? "border-red-500" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
