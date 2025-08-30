import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark", 
  enableSystem = false,
  disableTransitionOnChange = false,
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider 
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}