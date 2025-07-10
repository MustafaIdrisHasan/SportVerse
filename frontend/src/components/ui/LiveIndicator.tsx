import React from 'react';

interface LiveIndicatorProps {
  count: number;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  count,
  label,
  color = '#ef4444',
  size = 'md',
  animated = true
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <div 
      className={`inline-flex items-center space-x-2 rounded-full border font-sport font-bold transition-all duration-300 ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${color}20`,
        borderColor: `${color}40`,
        color: color
      }}
    >
      <div 
        className={`rounded-full ${dotSizes[size]} ${animated ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: color }}
      />
      <span>{count}</span>
      <span className="opacity-80">{label}</span>
    </div>
  );
};

export default LiveIndicator;
