import React from 'react';
import './Card.css';

// Layering principle: surface -> surface_container_low -> surface_container_highest
export const Card = ({ children, level = 'lowest', className = '', style, onClick, ...rest }) => {
  // map levels to surface css variables
  const getLevelClass = () => {
    switch (level) {
      case 'low': return 'surface-low';
      case 'high': return 'surface-high';
      case 'highest': return 'surface-highest';
      case 'lowest':
      default: return 'surface-lowest';
    }
  };

  return (
    <div className={`card ${getLevelClass()} ${className}`} style={style} onClick={onClick} {...rest}>
      {children}
    </div>
  );
};
