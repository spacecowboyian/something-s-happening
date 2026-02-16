import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import styles from './Button.module.css';

export function Button({ children, className, ...props }: ButtonProps) {
  const combinedClassName = className ? `${styles.button} ${className}` : styles.button;
  
  return (
    <AriaButton
      {...props}
      className={combinedClassName}
    >
      {children}
    </AriaButton>
  );
}
