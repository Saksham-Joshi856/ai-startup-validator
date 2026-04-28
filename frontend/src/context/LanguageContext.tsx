import React, { createContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "es" | "fr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = React.useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
};

// Translation definitions
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navigation
        dashboard: "Dashboard",
        validate: "Validate Idea",
        reports: "Reports",
        advisor: "AI Advisor",
        settings: "Settings",

        // Settings Page
        managePreferences: "Manage your account preferences and application settings",
        accountSettings: "Account Settings",
        emailAddress: "Email Address",
        fullName: "Full Name",

        // Notifications
        notifications: "Notifications",
        emailNotifications: "Email Notifications",
        emailNotificationsDesc: "Receive email updates about your validations",
        pushNotifications: "Push Notifications",
        pushNotificationsDesc: "Get push alerts for important updates",

        // Appearance
        appearance: "Appearance",
        darkMode: "Dark Mode",
        darkModeDesc: "Use dark theme for the application",

        // Privacy & Security
        privacySecurity: "Privacy & Security",
        analytics: "Analytics Tracking",
        analyticsDesc: "Allow us to collect anonymous usage data",

        // Language & Region
        languageRegion: "Language & Region",
        selectLanguage: "Select Language",
        english: "English",
        spanish: "Spanish",
        french: "French",
        german: "German",
        japanese: "Japanese",

        // Session
        session: "Session",
        signOutDesc: "Sign out from your account on this device",
        signOut: "Sign Out",
        signingOut: "Signing out...",
    },
    es: {
        // Navigation
        dashboard: "Tablero",
        validate: "Validar Idea",
        reports: "Informes",
        advisor: "Asesor IA",
        settings: "Configuraciones",

        // Settings Page
        managePreferences: "Administra tus preferencias de cuenta y configuración de la aplicación",
        accountSettings: "Configuración de Cuenta",
        emailAddress: "Correo Electrónico",
        fullName: "Nombre Completo",

        // Notifications
        notifications: "Notificaciones",
        emailNotifications: "Notificaciones por Correo",
        emailNotificationsDesc: "Recibe actualizaciones por correo sobre tus validaciones",
        pushNotifications: "Notificaciones Push",
        pushNotificationsDesc: "Recibe alertas push para actualizaciones importantes",

        // Appearance
        appearance: "Apariencia",
        darkMode: "Modo Oscuro",
        darkModeDesc: "Usa el tema oscuro en la aplicación",

        // Privacy & Security
        privacySecurity: "Privacidad y Seguridad",
        analytics: "Seguimiento de Análisis",
        analyticsDesc: "Permítenos recopilar datos de uso anónimo",

        // Language & Region
        languageRegion: "Idioma y Región",
        selectLanguage: "Selecciona Idioma",
        english: "Inglés",
        spanish: "Español",
        french: "Francés",
        german: "Alemán",
        japanese: "Japonés",

        // Session
        session: "Sesión",
        signOutDesc: "Cierra sesión en tu cuenta en este dispositivo",
        signOut: "Cerrar Sesión",
        signingOut: "Cerrando sesión...",
    },
    fr: {
        // Navigation
        dashboard: "Tableau de Bord",
        validate: "Valider Idée",
        reports: "Rapports",
        advisor: "Conseiller IA",
        settings: "Paramètres",

        // Settings Page
        managePreferences: "Gérez vos préférences de compte et les paramètres de l'application",
        accountSettings: "Paramètres du Compte",
        emailAddress: "Adresse Email",
        fullName: "Nom Complet",

        // Notifications
        notifications: "Notifications",
        emailNotifications: "Notifications par Email",
        emailNotificationsDesc: "Recevez des mises à jour par email sur vos validations",
        pushNotifications: "Notifications Push",
        pushNotificationsDesc: "Recevez des alertes push pour les mises à jour importantes",

        // Appearance
        appearance: "Apparence",
        darkMode: "Mode Sombre",
        darkModeDesc: "Utilisez le thème sombre pour l'application",

        // Privacy & Security
        privacySecurity: "Confidentialité et Sécurité",
        analytics: "Suivi Analytique",
        analyticsDesc: "Permettez-nous de collecter des données d'utilisation anonymes",

        // Language & Region
        languageRegion: "Langue et Région",
        selectLanguage: "Sélectionner la Langue",
        english: "Anglais",
        spanish: "Espagnol",
        french: "Français",
        german: "Allemand",
        japanese: "Japonais",

        // Session
        session: "Session",
        signOutDesc: "Déconnectez-vous de votre compte sur cet appareil",
        signOut: "Déconnexion",
        signingOut: "Déconnexion en cours...",
    },
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>("en");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem("app-language") as Language | null;
        if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es" || savedLanguage === "fr")) {
            setLanguageState(savedLanguage);
        }
        setIsLoaded(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("app-language", lang);
    };

    // Translation helper function
    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations["en"]] || key;
    };

    if (!isLoaded) {
        return <>{children}</>;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
