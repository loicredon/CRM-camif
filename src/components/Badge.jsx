import React from 'react';
import './Badge.css';

export const Badge = ({ status = 'active', children, style, className = '' }) => {
  return (
    <span className={`badge badge-${status} ${className}`} style={style}>
      {children}
    </span>
  );
};
