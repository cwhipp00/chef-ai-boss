import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  className,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Only update the parent value if it's a valid number
    const numericValue = parseInt(newValue, 10);
    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      onChange(numericValue);
    }
  };

  const handleInputBlur = () => {
    // On blur, ensure the input shows the actual value
    const numericValue = parseInt(inputValue, 10);
    if (isNaN(numericValue) || numericValue < min || numericValue > max) {
      setInputValue(value.toString());
    }
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    } else if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8 p-0 rounded-r-none border-r-0 hover:bg-muted focus:z-10"
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        className="h-8 w-16 text-center rounded-none border-x-0 focus:z-10 px-1"
        min={min}
        max={max}
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8 p-0 rounded-l-none border-l-0 hover:bg-muted focus:z-10"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};