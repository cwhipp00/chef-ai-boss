import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorTheme = 'warm-amber' | 'ocean-blue' | 'fresh-green' | 'deep-dark' | 'pure-white' | 'bright-white';
export type DisplayMode = 'light' | 'dark' | 'auto';
export type FontSize = 'small' | 'normal' | 'large' | 'x-large';
export type InterfaceDensity = 'compact' | 'normal' | 'comfortable';

interface AppearanceSettings {
  colorTheme: ColorTheme;
  displayMode: DisplayMode;
  fontSize: FontSize;
  interfaceDensity: InterfaceDensity;
  hoverEffects: boolean;
  smoothTransitions: boolean;
  loadingAnimations: boolean;
  reducedMotion: boolean;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateColorTheme: (theme: ColorTheme) => void;
  updateDisplayMode: (mode: DisplayMode) => void;
  updateFontSize: (size: FontSize) => void;
  updateInterfaceDensity: (density: InterfaceDensity) => void;
  updateAnimationSetting: (setting: keyof Pick<AppearanceSettings, 'hoverEffects' | 'smoothTransitions' | 'loadingAnimations' | 'reducedMotion'>, value: boolean) => void;
}

const defaultSettings: AppearanceSettings = {
  colorTheme: 'warm-amber',
  displayMode: 'auto',
  fontSize: 'normal',
  interfaceDensity: 'normal',
  hoverEffects: true,
  smoothTransitions: true,
  loadingAnimations: true,
  reducedMotion: false,
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    try {
      const stored = localStorage.getItem('appearance-settings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Color themes configuration
  const colorThemes = {
    'warm-amber': {
      primary: '25 95% 53%',
      primaryGlow: '25 95% 70%',
      accent: '15 85% 60%',
      success: '142 76% 36%',
    },
    'ocean-blue': {
      primary: '221 83% 53%',
      primaryGlow: '221 83% 70%',
      accent: '262 83% 58%',
      success: '142 71% 45%',
    },
    'fresh-green': {
      primary: '142 76% 36%',
      primaryGlow: '142 76% 55%',
      accent: '173 58% 39%',
      success: '160 84% 39%',
    },
    'deep-dark': {
      primary: '270 95% 25%',
      primaryGlow: '270 95% 45%',
      accent: '300 80% 35%',
      success: '120 60% 30%',
    },
    'pure-white': {
      primary: '200 15% 35%',
      primaryGlow: '200 15% 55%',
      accent: '210 20% 45%',
      success: '140 40% 45%',
    },
    'bright-white': {
      primary: '210 40% 92%',
      primaryGlow: '210 40% 88%',
      accent: '220 30% 85%',
      success: '150 50% 85%',
    }
  };

  // Font size scales
  const fontSizeScales = {
    small: '0.875',
    normal: '1',
    large: '1.125',
    'x-large': '1.25'
  };

  // Interface density spacing
  const densitySpacing = {
    compact: '0.75',
    normal: '1',
    comfortable: '1.25'
  };

  // Apply settings to CSS custom properties
  useEffect(() => {
    console.log('🔧 Applying appearance settings:', settings);
    const root = document.documentElement;
    
    // Apply color theme with !important to override CSS specificity
    const theme = colorThemes[settings.colorTheme];
    console.log('🎨 Applying theme colors:', theme);
    root.style.setProperty('--primary', theme.primary, 'important');
    root.style.setProperty('--primary-glow', theme.primaryGlow, 'important');
    root.style.setProperty('--accent', theme.accent, 'important');
    root.style.setProperty('--success', theme.success, 'important');
    root.style.setProperty('--ring', theme.primary, 'important');
    
    // Apply font size (remove hardcoded fontSize setting)
    const fontSize = fontSizeScales[settings.fontSize];
    root.style.setProperty('--font-size-scale', fontSize);
    
    // Apply interface density
    const density = densitySpacing[settings.interfaceDensity];
    root.style.setProperty('--spacing-scale', density);
    
    // Apply display mode (dark/light) - force override any existing classes
    console.log('🌙 Applying display mode:', settings.displayMode);
    
    // Remove existing dark class first
    root.classList.remove('dark');
    
    if (settings.displayMode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('🌙 Auto mode - system prefers dark:', prefersDark);
      if (prefersDark) {
        root.classList.add('dark');
      }
    } else if (settings.displayMode === 'dark') {
      console.log('🌙 Manual mode - setting dark: true');
      root.classList.add('dark');
    } else {
      console.log('🌙 Manual mode - setting light: true');
      // Light mode - dark class already removed above
    }
    
    // Apply animation settings
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    root.classList.toggle('no-hover-effects', !settings.hoverEffects);
    root.classList.toggle('no-transitions', !settings.smoothTransitions);
    root.classList.toggle('no-loading-animations', !settings.loadingAnimations);
    
    // Store in localStorage
    localStorage.setItem('appearance-settings', JSON.stringify(settings));
    console.log('💾 Settings saved to localStorage');
  }, [settings]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (settings.displayMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        console.log('🌙 System theme changed - prefers dark:', e.matches);
        const root = document.documentElement;
        root.classList.remove('dark');
        if (e.matches) {
          root.classList.add('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.displayMode]);

  const updateColorTheme = (theme: ColorTheme) => {
    console.log('🎨 Color theme changing to:', theme);
    setSettings(prev => ({ ...prev, colorTheme: theme }));
  };

  const updateDisplayMode = (mode: DisplayMode) => {
    console.log('🌙 Display mode changing to:', mode);
    setSettings(prev => ({ ...prev, displayMode: mode }));
  };

  const updateFontSize = (size: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const updateInterfaceDensity = (density: InterfaceDensity) => {
    setSettings(prev => ({ ...prev, interfaceDensity: density }));
  };

  const updateAnimationSetting = (
    setting: keyof Pick<AppearanceSettings, 'hoverEffects' | 'smoothTransitions' | 'loadingAnimations' | 'reducedMotion'>, 
    value: boolean
  ) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const value: AppearanceContextType = {
    settings,
    updateColorTheme,
    updateDisplayMode,
    updateFontSize,
    updateInterfaceDensity,
    updateAnimationSetting,
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}