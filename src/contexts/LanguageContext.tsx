import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.recipes': 'Recipes',
    'nav.checklists': 'Checklists',
    'nav.calendar': 'Calendar',
    'nav.communications': 'Communications',
    'nav.reminders': 'Reminders',
    'nav.documents': 'Documents',
    'nav.reservations': 'Reservations',
    'nav.staff-schedule': 'Staff Schedule',
    'nav.customers': 'Customers',
    'nav.training': 'Training',
    'nav.settings': 'Settings',
    
    // Manager Only
    'nav.ai-agents': 'AI Agents',
    'nav.orders': 'Orders',
    'nav.manager': 'Manager Tools',
    'nav.finance': 'Finance',
    
    // Section Headers
    'section.operations': 'Operations',
    'section.management': 'Management',
    'section.business': 'Business',
    'section.system': 'System',
    
    // Common
    'common.manager': 'Manager',
    'common.language': 'Language',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.recipes': 'Recetas',
    'nav.checklists': 'Listas de Verificación',
    'nav.calendar': 'Calendario',
    'nav.communications': 'Comunicaciones',
    'nav.reminders': 'Recordatorios',
    'nav.documents': 'Documentos',
    'nav.reservations': 'Reservaciones',
    'nav.staff-schedule': 'Horario del Personal',
    'nav.customers': 'Clientes',
    'nav.training': 'Entrenamiento',
    'nav.settings': 'Configuración',
    
    // Manager Only
    'nav.ai-agents': 'Agentes IA',
    'nav.orders': 'Pedidos',
    'nav.manager': 'Herramientas de Gestión',
    'nav.finance': 'Finanzas',
    
    // Section Headers
    'section.operations': 'Operaciones',
    'section.management': 'Gestión',
    'section.business': 'Negocio',
    'section.system': 'Sistema',
    
    // Common
    'common.manager': 'Gerente',
    'common.language': 'Idioma',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.recipes': 'Recettes',
    'nav.checklists': 'Listes de Contrôle',
    'nav.calendar': 'Calendrier',
    'nav.communications': 'Communications',
    'nav.reminders': 'Rappels',
    'nav.documents': 'Documents',
    'nav.reservations': 'Réservations',
    'nav.staff-schedule': 'Planning du Personnel',
    'nav.customers': 'Clients',
    'nav.training': 'Formation',
    'nav.settings': 'Paramètres',
    
    // Manager Only
    'nav.ai-agents': 'Agents IA',
    'nav.orders': 'Commandes',
    'nav.manager': 'Outils de Gestion',
    'nav.finance': 'Finance',
    
    // Section Headers
    'section.operations': 'Opérations',
    'section.management': 'Gestion',
    'section.business': 'Affaires',
    'section.system': 'Système',
    
    // Common
    'common.manager': 'Gestionnaire',
    'common.language': 'Langue',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}