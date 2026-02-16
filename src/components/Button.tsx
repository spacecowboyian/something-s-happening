import { Button as AriaButton, ButtonProps } from 'react-aria-components';

const buttonStyles = 
  'px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 ' +
  'pressed:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
  'focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({ children, className, ...props }: ButtonProps) {
  const combinedClassName = className ? `${buttonStyles} ${className}` : buttonStyles;
  
  return (
    <AriaButton
      {...props}
      className={combinedClassName}
    >
      {children}
    </AriaButton>
  );
}
