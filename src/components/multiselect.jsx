import Select from "react-select";

const MultiSelect = ({ options, onChange, className, placeholder }) => {
  return <Select options={options} onChange={onChange} isMulti placeholder={placeholder} className={`max-w-sm w-full ${className}`} />;
};

export default MultiSelect;
