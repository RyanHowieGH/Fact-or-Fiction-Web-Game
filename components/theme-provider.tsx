// components/theme-provider.tsx

'use client'

import * as React from 'react'
// Import only the component itself now
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// Infer the props type directly from the imported component
// This gets the props type that NextThemesProvider actually accepts
type ActualThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

// Use the inferred type for your component's props
export function ThemeProvider({ children, ...props }: ActualThemeProviderProps) {
  // Pass the received props down to the actual provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}