import React from "react";

interface SelectFieldProps {
  id: string;
  label: string;
  options: (string | undefined)[];
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, options, value, onChange, error }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-semibold mb-1">{label}</label>
      <select
        id={id}
        value={value ?? ""}
        onChange={onChange}
        className={`border rounded p-2 ${error ? "border-red-500" : "border-gray-300"}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option ?? ""}>
            {option ?? "-- Choisir --"}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default SelectField;
