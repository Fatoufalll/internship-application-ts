import React from "react";

interface SelectFieldProps {
  id: string;
  label: string;
  options: Array<string>;
  value: string | "";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, options, value, onChange, error }) => {
  return (
    <div>
      <label className="block font-semibold mb-1" htmlFor={id}>{label}</label>
      <select
        required
        id={id}
        className={`w-full border p-2 rounded ${error ? "border-red-500" : ""}`}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option === "" ? "-- Choisir --" : option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
