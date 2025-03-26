export const Label = ({ label, required }) => {
  return (
    <label htmlFor={`i-${label}`} className="capitalize text-sm">
      {label}
      {required ? <span className="text-red-600"> *</span> : null}
    </label>
  );
};

export const TextInput = ({
  name,
  label,
  placeholder,
  type = "text",
  required = true,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label label={label} required={required} />
      <input
        name={name}
        id={`i-${label}`}
        type={type}
        className="border text-sm outline-none p-2 rounded-md"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const RadioInput = ({
  name,
  label,
  required = true,
  options,
  onChange,
  value,
}) => {
  const handleChange = (optionValue) => {
    onChange(optionValue);
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label label={label} required={required} />
        {options.map((key, index) => (
          <div className="space-x-2" key={index}>
            <input
              id={`i-${name}${key}`}
              type="radio"
              name={name}
              checked={value === key}
              onChange={() => handleChange(key)}
            />
            <label htmlFor={`i-${name}${key}`} className="capitalize text-sm">
              {key}
            </label>{" "}
          </div>
        ))}
      </div>
    </>
  );
};

export const SelectInput = ({
  name,
  label,
  required = true,
  options,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col gap-2">
    <Label label={label} required={required} />
    <select
      name={name}
      id={`i-${label}`}
      className="w-full p-2 text-sm border rounded-md bg-white"
      value={value}
      onChange={onChange}
    >
      <option>{placeholder}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);

export const MultiCheckBoxSelect = ({
  name,
  label,
  type,
  required = true,
  options,
  value = [],
  onChange,
}) => {
  const handleCheckboxChange = (optionValue, isChecked) => {
    const newValue = isChecked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label label={label} required={required} />
      {options.map((option) => (
        <div key={option} className="flex gap-2 items-center">
          <input
            name={name}
            type={type}
            checked={value.includes(option)}
            onChange={(e) => handleCheckboxChange(option, e.target.checked)}
            id={`i-${option}`}
          />
          <Label label={option} />
        </div>
      ))}
    </div>
  );
};

export const FileUpload = ({ name, label, required = true, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label label={label} required={required} />
      <input name={name} type="file" onChange={onChange} />
    </div>
  );
};
