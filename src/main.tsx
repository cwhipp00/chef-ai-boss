import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { ThemeProvider } from '@/providers/theme-provider'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LanguageProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <SubscriptionProvider>
          <App />
        </SubscriptionProvider>
      </ThemeProvider>
    </LanguageProvider>
  </AuthProvider>
);
