import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  customColorClass?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  customColorClass,
  ...props
}) => {
  // Base styles for all buttons, including transitions and transforms
  const baseStyles = `
    font-medium rounded-lg focus:outline-none 
    transition-all duration-300 ease-in-out 
    inline-flex items-center justify-center 
    shadow-liquid-btn-shadow hover:shadow-lg active:shadow-md 
    transform hover:-translate-y-px active:translate-y-0 hover:scale-[1.03] active:scale-[0.98]
    relative overflow-hidden
    border border-liquid-btn-border
    backdrop-blur-md 
  `;

  // Liquid glass background styles using complex gradients
  // This will be a base gradient, with hover/active states adjusting it or adding layers.
  // Using background-size and animation for subtle sheen
  const liquidGlassBaseBg = `bg-liquid-btn-bg`;
  // For a more dynamic sheen, we can use a pseudo-element or a more complex gradient animation.
  // Here, we'll use a base gradient that subtly changes on hover.

  // Variant styles: primarily control text color and focus ring.
  // The complex background is now handled by liquidGlassBaseBg and hover effects.
  const variantTextAndFocusStyles: Record<string, string> = {
    primary: 'text-main-accent hover:text-opacity-100 focus:ring-2 focus:ring-main-accent focus:ring-opacity-50',
    secondary: 'text-secondary-accent hover:text-opacity-100 focus:ring-2 focus:ring-secondary-accent focus:ring-opacity-50',
    ghost: 'text-text-primary hover:text-main-accent !bg-transparent hover:!bg-main-accent/10 backdrop-blur-none !border-transparent hover:!border-main-accent/20 focus:ring-2 focus:ring-main-accent focus:ring-opacity-50',
    danger: 'text-red-100 bg-red-500/70 hover:bg-red-600/80 border-red-400/50 focus:ring-2 focus:ring-red-500 focus:ring-opacity-60 backdrop-blur-sm', // Danger might not always be liquid glass
    highlight: 'text-highlight hover:text-opacity-100 focus:ring-2 focus:ring-highlight focus:ring-opacity-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Constructing the dynamic background for liquid glass effect
  // The gradient moves subtly on hover, giving a "liquid reflection" feel.
  // Note: True liquid reflection is very complex. This is an approximation.
  // The gradient changes direction or emphasis on hover/active.
  // Using a simpler approach for direct Tailwind: apply a base gradient and modify slightly on hover.

  let combinedStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${className}
  `;

  if (customColorClass) {
    combinedStyles = `${baseStyles} ${sizeStyles[size]} ${customColorClass} ${className}`;
  } else if (variant === 'danger') { // Danger button gets a more solid, less "liquid" look for clarity
    combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantTextAndFocusStyles[variant]} ${className}`;
  } else if (variant === 'ghost') {
     combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantTextAndFocusStyles[variant]} ${className}`;
  } else {
    // Apply liquid glass for other variants
    combinedStyles = `
      ${baseStyles}
      ${liquidGlassBaseBg}
      bg-gradient-to-tl hover:bg-gradient-to-br 
      from-liquid-sheen-light via-liquid-btn-bg to-liquid-sheen-dark 
      hover:from-liquid-sheen-dark hover:via-liquid-btn-hover-bg hover:to-liquid-sheen-light
      active:from-liquid-sheen-light active:via-liquid-btn-active-bg active:to-liquid-sheen-dark
      ${variantTextAndFocusStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `;
  }
  
  return (
    <button
      className={combinedStyles.replace(/\s\s+/g, ' ').trim()} // Clean up extra spaces
      {...props}
    >
      {/* Optional: Add a subtle animated sheen using a pseudo-element if desired for more complexity, 
          but Tailwind alone makes this tricky. Sticking to gradient shifts for now. */}
      {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
      <span className="flex-grow text-center relative z-10">{children}</span> {/* Ensure text is above any pseudo-elements if used */}
      {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
