import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type Language = 'es' | 'en' | 'ca';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.back': 'Volver al Dashboard',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.signup': 'Registrarse',
    'auth.email': 'Email',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.displayName': 'Nombre para mostrar',
    'auth.loginWithGoogle': 'Continuar con Google',
    'auth.alreadyAccount': '¿Ya tienes cuenta?',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.signout': 'Cerrar Sesión',
    
    // Dashboard
    'dashboard.totalPatrimony': 'Patrimonio Total',
    'dashboard.totalReturn': 'Retorno Total',
    'dashboard.economicActivity': 'Actividad Económica',
    'dashboard.investments': 'Inversiones',
    'dashboard.distributionByActivity': 'Distribución por Actividad Económica',
    'dashboard.distributionByCategory': 'Distribución por Categorías',
    'dashboard.economic': 'Económica',
    'dashboard.nonEconomic': 'No Económica',
    
    // Profile
    'profile.settings': 'Configuración',
    'profile.darkMode': 'Modo Oscuro',
    'profile.lightMode': 'Modo Claro',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.password': 'Cambiar Contraseña',
    'settings.notifications': 'Notificaciones por Email',
    'settings.currentPassword': 'Contraseña Actual',
    'settings.newPassword': 'Nueva Contraseña',
    'settings.save': 'Guardar',
    'settings.cancel': 'Cancelar',
    
    // Categories
    'category.details': 'Detalles de',
    'category.totalAmount': 'Importe Total',
    'category.totalElements': 'elementos',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.back': 'Back to Dashboard',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.displayName': 'Display Name',
    'auth.loginWithGoogle': 'Continue with Google',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.signout': 'Sign Out',
    
    // Dashboard
    'dashboard.totalPatrimony': 'Total Patrimony',
    'dashboard.totalReturn': 'Total Return',
    'dashboard.economicActivity': 'Economic Activity',
    'dashboard.investments': 'Investments',
    'dashboard.distributionByActivity': 'Distribution by Economic Activity',
    'dashboard.distributionByCategory': 'Distribution by Categories',
    'dashboard.economic': 'Economic',
    'dashboard.nonEconomic': 'Non-Economic',
    
    // Profile
    'profile.settings': 'Settings',
    'profile.darkMode': 'Dark Mode',
    'profile.lightMode': 'Light Mode',
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.password': 'Change Password',
    'settings.notifications': 'Email Notifications',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.save': 'Save',
    'settings.cancel': 'Cancel',
    
    // Categories
    'category.details': 'Details of',
    'category.totalAmount': 'Total Amount',
    'category.totalElements': 'elements',
  },
  ca: {
    // Navigation
    'nav.dashboard': 'Tauler',
    'nav.back': 'Tornar al Tauler',
    
    // Auth
    'auth.login': 'Iniciar Sessió',
    'auth.signup': 'Registrar-se',
    'auth.email': 'Email',
    'auth.password': 'Contrasenya',
    'auth.confirmPassword': 'Confirmar Contrasenya',
    'auth.displayName': 'Nom per mostrar',
    'auth.loginWithGoogle': 'Continuar amb Google',
    'auth.alreadyAccount': 'Ja tens compte?',
    'auth.noAccount': 'No tens compte?',
    'auth.signout': 'Tancar Sessió',
    
    // Dashboard
    'dashboard.totalPatrimony': 'Patrimoni Total',
    'dashboard.totalReturn': 'Retorn Total',
    'dashboard.economicActivity': 'Activitat Econòmica',
    'dashboard.investments': 'Inversions',
    'dashboard.distributionByActivity': 'Distribució per Activitat Econòmica',
    'dashboard.distributionByCategory': 'Distribució per Categories',
    'dashboard.economic': 'Econòmica',
    'dashboard.nonEconomic': 'No Econòmica',
    
    // Profile
    'profile.settings': 'Configuració',
    'profile.darkMode': 'Mode Fosc',
    'profile.lightMode': 'Mode Clar',
    
    // Settings
    'settings.title': 'Configuració',
    'settings.language': 'Idioma',
    'settings.password': 'Canviar Contrasenya',
    'settings.notifications': 'Notificacions per Email',
    'settings.currentPassword': 'Contrasenya Actual',
    'settings.newPassword': 'Nova Contrasenya',
    'settings.save': 'Desar',
    'settings.cancel': 'Cancel·lar',
    
    // Categories
    'category.details': 'Detalls de',
    'category.totalAmount': 'Import Total',
    'category.totalElements': 'elements',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateProfile } = useAuth();
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    if (profile?.language) {
      setLanguageState(profile.language);
    }
  }, [profile]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    if (profile) {
      await updateProfile({ language: lang });
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};