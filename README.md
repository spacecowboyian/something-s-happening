# something-s-happening

A Next.js React application built with TypeScript, React Aria, and a custom CSS design system.

🚀 **Live Demo**: [https://spacecowboyian.github.io/something-s-happening/](https://spacecowboyian.github.io/something-s-happening/)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application (static export for GitHub Pages)
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Jest tests

## Development Workflow

- For UI updates, validate in-browser behavior on the affected route(s), not only lint/tests.
- Recommended sequence: `npm run lint` → `npm run test` → `npm run dev` and verify in browser.
## Deployment

This application is automatically deployed to GitHub Pages on every push to the `main` branch. See [DEPLOYMENT.md](./DEPLOYMENT.md) for more details.

## Tech Stack

- **Next.js 16.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **React Aria Components** - Accessible UI component library
- **CSS Modules** - Component-scoped styling
- **CSS Custom Properties** - Design tokens for theming
- **ESLint** - Code linting
- **Jest** - Testing framework

## Design System

This project uses a comprehensive design system built with CSS custom properties (CSS variables). All design tokens are defined in `src/app/globals.css` and automatically support both light and dark themes.

### Design Tokens

- **Colors**: Gray scale + muted pastel palette (blue, purple, mint, green, peach, rose)
- **Spacing**: 4px base scale with t-shirt sizing (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
- **Typography**: Open Sans font family, 16px base size
- **Border Radius**: 2px to 24px with t-shirt sizing
- **Shadows**: 5 levels of depth
- **All values use px units only** (no rem or em)

### Theme Management

The application supports light and dark themes. The theme can be managed through the `ThemeProvider` component:

```tsx
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme ({theme})
    </button>
  );
}
```

## Styling Components

### Creating New Styled Components

When creating new React Aria components, follow these guidelines:

1. **Create a CSS Module** for each component (e.g., `ComponentName.module.css`)
2. **Use CSS custom properties** for all values (colors, spacing, typography, etc.)
3. **Never use hardcoded values** - always reference design tokens
4. **Support both themes automatically** by using semantic color tokens
5. **Use px units only** (no rem or em)
6. **Follow React Aria best practices** for accessible components

### Example: Creating a Styled Button

**Button.tsx**
```tsx
import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import styles from './Button.module.css';

export function Button({ children, className, ...props }: ButtonProps) {
  const combinedClassName = className ? `${styles.button} ${className}` : styles.button;
  
  return (
    <AriaButton {...props} className={combinedClassName}>
      {children}
    </AriaButton>
  );
}
```

**Button.module.css**
```css
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-inverse);
  background-color: var(--color-primary-500);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.button:hover {
  background-color: var(--color-primary-600);
}

.button[data-pressed] {
  background-color: var(--color-primary-700);
}

.button[data-focus-visible] {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.button:disabled {
  background-color: var(--color-disabled-background);
  color: var(--color-disabled-text);
  cursor: not-allowed;
  opacity: 0.6;
}
```

### Available Design Tokens

Reference these CSS custom properties in your component styles:

**Colors**
- `--color-primary-{50-900}` - Primary blue palette
- `--color-secondary-{50-900}` - Secondary purple palette
- `--color-accent-{50-900}` - Accent mint palette
- `--color-success-{50-900}` - Success green palette
- `--color-warning-{50-900}` - Warning peach palette
- `--color-error-{50-900}` - Error rose palette
- `--color-gray-{50-900}` - Gray scale
- `--color-background` - Main background color
- `--color-surface` - Surface/card background
- `--color-text-primary` - Primary text color
- `--color-text-secondary` - Secondary text color
- `--color-border` - Border color
- `--color-focus-ring` - Focus ring color

**Spacing**
- `--spacing-xs` - 4px
- `--spacing-sm` - 8px
- `--spacing-md` - 16px
- `--spacing-lg` - 24px
- `--spacing-xl` - 32px
- `--spacing-2xl` - 48px
- `--spacing-3xl` - 64px
- `--spacing-4xl` - 96px

**Typography**
- `--font-family-primary` - Open Sans
- `--font-size-{xs|sm|md|lg|xl|2xl|3xl|4xl}` - 12px to 48px
- `--line-height-{xs|sm|md|lg|xl|2xl|3xl|4xl}` - Corresponding line heights
- `--font-weight-{normal|medium|bold}` - 400, 600, 700

**Border Radius**
- `--radius-{xs|sm|md|lg|xl|2xl|full}` - 2px to 24px, plus full (9999px)

**Shadows**
- `--shadow-{xs|sm|md|lg|xl}` - 5 levels of shadows (auto-adjusts for dark theme)

**Transitions**
- `--transition-fast` - 150ms
- `--transition-normal` - 250ms
- `--transition-slow` - 350ms

### React Aria Integration

React Aria provides accessible behavior through data attributes. Use these in your CSS:

- `[data-hovered]` - Element is hovered
- `[data-pressed]` - Element is pressed
- `[data-focus-visible]` - Element has keyboard focus
- `[data-disabled]` - Element is disabled
- `[data-selected]` - Element is selected (for lists, etc.)

See the [React Aria documentation](https://react-spectrum.adobe.com/react-aria/) for more details on component patterns and accessibility features.

