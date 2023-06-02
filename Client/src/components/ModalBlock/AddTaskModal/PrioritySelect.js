import React from 'react';
import Select from 'react-select';

const options = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Medium' },
  { value: '3', label: 'High' }
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '4px',
    borderColor: '#252323',
    backgroundColor: '#1c1b1b',
    minHeight: '50px',
    height: '50px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#9928d2'
    },
    marginBottom: '20px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#5e1caf' : 'transparent',
    color: state.isSelected ? '#ffffff' : '#ffffff',
    '&:hover': {
      backgroundColor: '#5e1caf',
      color: '#ffffff'
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff'
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#ffffff'
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#424242',
    color: '#ffffff',
    textColor: '#ffffff'
  })
};







function PrioritySelect({ value, onChange }) {
  return (
    <Select
      options={options}
      styles={customStyles}
      value={{ value: value, label: value }}
      onChange={(option) => onChange(option.value)}
      />
  );
}

export default PrioritySelect;
