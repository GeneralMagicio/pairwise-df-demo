import React from 'react';

interface NumberBoxProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const NumberBox: React.FC<NumberBoxProps> = ({ min, max, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue === '-') {
      onChange(1);
      return;
    }

    // Allow empty input to clear the field
    if (inputValue === '') {
      onChange(NaN); // Or onChange(null) if you prefer handling empty as null
      return;
    }

    // Handle potential leading/trailing spaces and non-numeric characters
    const trimmedValue = inputValue.trim();
    if (/^\d+-$/g.test(trimmedValue)) {
      const num = -Number(trimmedValue.slice(0, -1)); // Convert "123-" to -123
      if (num >= min && num <= max) {
        onChange(num);
      }
      return;
    }
    else if (/^\d+-\d+$/.test(trimmedValue)) {
      const num = -Number(trimmedValue.replace('-', '')); // Handle cases like "123-456"
      if (num >= min && num <= max) {
        onChange(num);
      }
      return;
    }
    if (!/^-?\d+(\.\d{0,2})?$/.test(trimmedValue)) {
      return; // Invalid format, don't update
    }

    const num = parseFloat(trimmedValue);

    // Ensure within min/max range
    if (num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <input
      style={{ border: '1px solid #7F56D9', textAlign: 'center', width: '72px' }}
      type="string"
      min={min}
      max={max}
      step="0.01"
      value={isNaN(value) ? '' : value} // Handle NaN (empty) value
      onChange={handleChange}
    />
  );
};
