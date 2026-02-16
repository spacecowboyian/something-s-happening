# something-s-happening

A Next.js React application built with TypeScript, Tailwind CSS, and React Aria.

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
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run Jest tests

## Tech Stack

- **Next.js 16.1.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Aria Components** - Accessible UI component library
- **ESLint** - Code linting
- **Jest** - Testing framework

## UI Development

This project uses [React Aria](https://react-spectrum.adobe.com/react-aria/) for building accessible UI components. React Aria provides a library of React hooks and components that implement adaptive, accessible interactions for common UI patterns.

### Dark Theme

The application is configured with a **dark theme as the default**. The theme can be managed through the `ThemeProvider` component located in `src/components/ThemeProvider.tsx`.

### Creating Components

Example of creating an accessible button component:

```tsx
import { Button } from '@/components/Button';

function MyComponent() {
  return (
    <Button onPress={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### Theme Management

Access the current theme in your components:

```tsx
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```
