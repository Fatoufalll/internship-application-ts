import React from "react";

interface FileFieldProps {
  id: string;
  label: string;
  onChange: (file: File | null) => void;
  error?: string;
}

const FileField: React.FC<FileFieldProps> = ({ id, label, onChange, error }) => {
  return (
    <div>
      <label className="block font-semibold mb-1" htmlFor={id}>{label}</label>
      <input
        type="file"
        accept="application/pdf"
        id={id}
        className={`w-full border p-2 rounded bg-white ${error ? "border-red-500" : ""}`}
        onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
        aria-invalid={!!error}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FileField;
