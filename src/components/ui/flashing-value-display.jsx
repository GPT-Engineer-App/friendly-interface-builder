import React, { useState, useEffect, useRef } from 'react';

const FlashingValueDisplay = ({ 
  value, 
  className = '',
  formatValue = (v) => v.toString(),
}) => {
  const [displayValue, setDisplayValue] = useState(formatValue(value));
  const [flashColor, setFlashColor] = useState('');
  const prevValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof value !== 'number') {
      console.warn('FlashingValueDisplay received a non-numeric value');
      return;
    }

    setDisplayValue(formatValue(value));

    setDisplayValue(formatValue(value));

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else if (value !== prevValueRef.current) {
      if (value > prevValueRef.current) {
        setFlashColor('green');
      } else if (value < prevValueRef.current) {
        setFlashColor('red');
      }

      const timer = setTimeout(() => setFlashColor(''), 300);
      return () => clearTimeout(timer);
    }

    prevValueRef.current = value;
  }, [value, formatValue]);

  const getBackgroundColor = () => {
    switch (flashColor) {
      case 'green': return 'bg-green-200';
      case 'red': return 'bg-red-200';
      default: return 'transparent';
    }
  };

  return (
    <div
      className={`transition-colors duration-300 ${getBackgroundColor()} ${className}`}
    >
      {displayValue}
    </div>
  );
};

export {
    FlashingValueDisplay
};