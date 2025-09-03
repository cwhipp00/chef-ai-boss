import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { AppearanceProvider } from '@/contexts/AppearanceContext'
import { ThemeProvider } from '@/providers/theme-provider'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LanguageProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppearanceProvider>
          <SubscriptionProvider>
            <App />
          </SubscriptionProvider>
        </AppearanceProvider>
      </ThemeProvider>
    </LanguageProvider>
  </AuthProvider>
);
