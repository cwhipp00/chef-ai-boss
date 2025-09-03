import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { AppearanceProvider } from '@/contexts/AppearanceContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LanguageProvider>
      <AppearanceProvider>
        <SubscriptionProvider>
          <App />
        </SubscriptionProvider>
      </AppearanceProvider>
    </LanguageProvider>
  </AuthProvider>
);
