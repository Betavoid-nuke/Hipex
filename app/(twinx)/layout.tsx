// /app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';

// Metadata for the application
export const metadata: Metadata = {
  title: 'TwinX Dashboard',
  description: 'Your Digital Twin Management Platform',
};

/**
 * RootLayout component
 * This is the main server component layout that wraps the entire application.
 * It sets up the basic HTML structure and includes global styles.
 *
 * @param {object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered root layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}