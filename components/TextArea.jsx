import React from "react";

const TextArea = ({ rows, value, onChange, name, label, placeholder }) => {
  return (
    <div className="space-y-1">
      <label>{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="w-full bg-primaryColorLight p-3 rounded-lg"
      />
    </div>
  );
};

export default TextArea;
