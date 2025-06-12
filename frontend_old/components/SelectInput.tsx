import React from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface SelectInputProps<T extends string | number> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'placeholder'> {
  label?: string;
  options: { value: T; label: string }[];
  containerClassName?: string;
  placeholder?: string; 
}

const SelectInput = <T extends string | number,>({ 
  label, 
  options, 
  id, 
  containerClassName = '', 
  className = '', 
  placeholder, 
  ...props 
}: SelectInputProps<T>) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && <label htmlFor={id || props.name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <div className="relative">
        <select
          id={id || props.name}
          className={`block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-main-accent focus:border-main-accent sm:text-sm text-text-primary ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled hidden>{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default SelectInput;