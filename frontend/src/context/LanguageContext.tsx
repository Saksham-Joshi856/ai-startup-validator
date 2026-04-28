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

        // Dashboard Page
        dashboardTitle: "Dashboard",
        dashboardSubtitle: "Real-time startup validation analytics & insights",
        totalIdeasAnalyzed: "Total Ideas Analyzed",
        averageStartupScore: "Average Startup Score",
        successRate: "Success Rate",
        recentValidations: "Recent Validations",
        insights: "Insights",
        smartSuggestions: "Smart Suggestions",
        scoreOutOf: "/100",
        percentageSymbol: "%",

        // Validate Idea Page
        validateTitle: "Validate Idea",
        validateSubtitle: "Analyze your startup idea with AI-powered insights",
        yourIdea: "Your Idea",
        enterIdeaDescription: "Describe your startup idea in detail...",
        selectIndustry: "Select Industry",
        analyzeIdea: "Analyze Idea",
        analyzing: "Analyzing",
        marketPotential: "Market Potential",
        competition: "Competition Analysis",
        feasibility: "Feasibility",
        aiSuggestions: "AI Suggestions",
        analyzingMarket: "Analyzing market potential...",
        evaluatingCompetition: "Evaluating competition landscape...",
        calculatingFeasibility: "Calculating feasibility score...",
        generatingAiSuggestions: "Generating AI suggestions...",

        // Reports Page
        reportsTitle: "My Reports",
        reportsSubtitle: "View, filter, compare, and re-analyze your startup validation reports",
        noReports: "No reports yet. Start by validating an idea.",
        reports: "Reports",
        reAnalyze: "Re-analyze",
        compare: "Compare",
        delete: "Delete",
        showAnalysis: "Show Analysis",
        hideAnalysis: "Hide Analysis",
        scoreBreakdown: "Score Breakdown",

        // Advisor Page
        advisorTitle: "AI Advisor",
        advisorSubtitle: "Get personalized recommendations for your startup",
        askQuestion: "Ask a Question",
        sendMessage: "Send",
        typing: "AI is thinking...",
        noMessages: "Start a conversation with your AI Advisor",

        // Settings Page
        settingsTitle: "Settings",
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

        // Common UI
        loading: "Loading...",
        error: "Error",
        success: "Success",
        warning: "Warning",
        info: "Information",
        close: "Close",
        cancel: "Cancel",
        save: "Save",
        submit: "Submit",
        back: "Back",
        next: "Next",
        previous: "Previous",
        loading_ellipsis: "Loading...",
        tryAgain: "Try Again",
        somethingWentWrong: "Something went wrong",
    },
    es: {
        // Navigation
        dashboard: "Tablero",
        validate: "Validar Idea",
        reports: "Informes",
        advisor: "Asesor IA",
        settings: "Configuraciones",

        // Dashboard Page
        dashboardTitle: "Tablero",
        dashboardSubtitle: "Análisis y perspectivas de validación de startups en tiempo real",
        totalIdeasAnalyzed: "Total de Ideas Analizadas",
        averageStartupScore: "Puntuación Promedio de Startup",
        successRate: "Tasa de Éxito",
        recentValidations: "Validaciones Recientes",
        insights: "Perspectivas",
        smartSuggestions: "Sugerencias Inteligentes",
        scoreOutOf: "/100",
        percentageSymbol: "%",

        // Validate Idea Page
        validateTitle: "Validar Idea",
        validateSubtitle: "Analiza tu idea de startup con información potenciada por IA",
        yourIdea: "Tu Idea",
        enterIdeaDescription: "Describe tu idea de startup en detalle...",
        selectIndustry: "Selecciona Industria",
        analyzeIdea: "Analizar Idea",
        analyzing: "Analizando",
        marketPotential: "Potencial de Mercado",
        competition: "Análisis de Competencia",
        feasibility: "Viabilidad",
        aiSuggestions: "Sugerencias de IA",
        analyzingMarket: "Analizando potencial de mercado...",
        evaluatingCompetition: "Evaluando panorama competitivo...",
        calculatingFeasibility: "Calculando puntuación de viabilidad...",
        generatingAiSuggestions: "Generando sugerencias de IA...",

        // Reports Page
        reportsTitle: "Mis Informes",
        reportsSubtitle: "Ver, filtrar, comparar y re-analizar tus informes de validación de startups",
        noReports: "Sin informes aún. Comienza validando una idea.",
        reports: "Informes",
        reAnalyze: "Re-analizar",
        compare: "Comparar",
        delete: "Eliminar",
        showAnalysis: "Mostrar Análisis",
        hideAnalysis: "Ocultar Análisis",
        scoreBreakdown: "Desglose de Puntuaciones",

        // Advisor Page
        advisorTitle: "Asesor IA",
        advisorSubtitle: "Obtén recomendaciones personalizadas para tu startup",
        askQuestion: "Hacer una Pregunta",
        sendMessage: "Enviar",
        typing: "La IA está pensando...",
        noMessages: "Inicia una conversación con tu Asesor de IA",

        // Settings Page
        settingsTitle: "Configuraciones",
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

        // Common UI
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        warning: "Advertencia",
        info: "Información",
        close: "Cerrar",
        cancel: "Cancelar",
        save: "Guardar",
        submit: "Enviar",
        back: "Atrás",
        next: "Siguiente",
        previous: "Anterior",
        loading_ellipsis: "Cargando...",
        tryAgain: "Intentar de Nuevo",
        somethingWentWrong: "Algo salió mal",
    },
    fr: {
        // Navigation
        dashboard: "Tableau de Bord",
        validate: "Valider Idée",
        reports: "Rapports",
        advisor: "Conseiller IA",
        settings: "Paramètres",

        // Dashboard Page
        dashboardTitle: "Tableau de Bord",
        dashboardSubtitle: "Analyse et perspectives de validation de startups en temps réel",
        totalIdeasAnalyzed: "Nombre Total d'Idées Analysées",
        averageStartupScore: "Score Moyen de Démarrage",
        successRate: "Taux de Réussite",
        recentValidations: "Validations Récentes",
        insights: "Perspectives",
        smartSuggestions: "Suggestions Intelligentes",
        scoreOutOf: "/100",
        percentageSymbol: "%",

        // Validate Idea Page
        validateTitle: "Valider Idée",
        validateSubtitle: "Analysez votre idée de startup avec des informations alimentées par l'IA",
        yourIdea: "Votre Idée",
        enterIdeaDescription: "Décrivez votre idée de startup en détail...",
        selectIndustry: "Sélectionner l'Industrie",
        analyzeIdea: "Analyser l'Idée",
        analyzing: "Analyse en cours",
        marketPotential: "Potentiel de Marché",
        competition: "Analyse de la Concurrence",
        feasibility: "Faisabilité",
        aiSuggestions: "Suggestions de l'IA",
        analyzingMarket: "Analyse du potentiel du marché...",
        evaluatingCompetition: "Évaluation du paysage concurrentiel...",
        calculatingFeasibility: "Calcul du score de faisabilité...",
        generatingAiSuggestions: "Génération de suggestions de l'IA...",

        // Reports Page
        reportsTitle: "Mes Rapports",
        reportsSubtitle: "Consultez, filtrez, comparez et réanalysez vos rapports de validation de startups",
        noReports: "Aucun rapport pour le moment. Commencez par valider une idée.",
        reports: "Rapports",
        reAnalyze: "Réanalyser",
        compare: "Comparer",
        delete: "Supprimer",
        showAnalysis: "Afficher l'Analyse",
        hideAnalysis: "Masquer l'Analyse",
        scoreBreakdown: "Répartition des Scores",

        // Advisor Page
        advisorTitle: "Conseiller IA",
        advisorSubtitle: "Obtenez des recommandations personnalisées pour votre startup",
        askQuestion: "Poser une Question",
        sendMessage: "Envoyer",
        typing: "L'IA réfléchit...",
        noMessages: "Commencez une conversation avec votre Conseiller IA",

        // Settings Page
        settingsTitle: "Paramètres",
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

        // Common UI
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
        warning: "Avertissement",
        info: "Information",
        close: "Fermer",
        cancel: "Annuler",
        save: "Enregistrer",
        submit: "Soumettre",
        back: "Retour",
        next: "Suivant",
        previous: "Précédent",
        loading_ellipsis: "Chargement...",
        tryAgain: "Réessayer",
        somethingWentWrong: "Quelque chose s'est mal passé",
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
