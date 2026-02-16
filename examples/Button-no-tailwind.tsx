/**
 * Alternative Button Component WITHOUT Tailwind
 * 
 * This demonstrates what the Button component would look like
 * if we replaced Tailwind with plain CSS.
 * 
 * Compare this to: src/components/Button.tsx
 */

import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import './Button-no-tailwind.css'; // Would need this CSS file

export function ButtonNoTailwind({ children, className, ...props }: ButtonProps) {
  const combinedClassName = className ? `btn ${className}` : 'btn';
  
  return (
    <AriaButton
      {...props}
      className={combinedClassName}
    >
      {children}
    </AriaButton>
  );
}

/**
 * Comparison:
 * 
 * WITH Tailwind (current):
 * - 1 line of utility classes in the component
 * - 0 separate CSS file needed
 * - Dark mode automatic with dark: prefix
 * 
 * WITHOUT Tailwind (this example):
 * - 1 class name in component
 * - ~50 lines in separate CSS file
 * - Manual dark mode with .dark selector
 */
