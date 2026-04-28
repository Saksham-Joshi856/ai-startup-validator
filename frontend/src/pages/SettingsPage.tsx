import { motion } from "framer-motion";
import { Settings, Bell, Shield, Moon, Globe, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/context/LanguageContext";

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        darkMode: theme === "dark",
        analytics: true,
    });
    const [loading, setLoading] = useState(false);

    const handleToggle = (key: string) => {
        if (key === "darkMode") {
            toggleTheme();
        }
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLanguageChange = (newLanguage: string) => {
        if (newLanguage === "en" || newLanguage === "es" || newLanguage === "fr") {
            setLanguage(newLanguage);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            navigate("/");
        } catch (err) {
            console.error("Logout exception:", err);
        } finally {
            setLoading(false);
        }
    };

    const settingsSections = [
        {
            title: t("notifications"),
            titleKey: "notifications",
            icon: Bell,
            color: "text-blue-500",
            settings: [
                {
                    id: "emailNotifications",
                    labelKey: "emailNotifications",
                    descKey: "emailNotificationsDesc",
                },
                {
                    id: "pushNotifications",
                    labelKey: "pushNotifications",
                    descKey: "pushNotificationsDesc",
                },
            ],
        },
        {
            title: t("appearance"),
            titleKey: "appearance",
            icon: Moon,
            color: "text-purple-500",
            settings: [
                {
                    id: "darkMode",
                    labelKey: "darkMode",
                    descKey: "darkModeDesc",
                },
            ],
        },
        {
            title: t("privacySecurity"),
            titleKey: "privacySecurity",
            icon: Shield,
            color: "text-green-500",
            settings: [
                {
                    id: "analytics",
                    labelKey: "analytics",
                    descKey: "analyticsDesc",
                },
            ],
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <div className="relative px-6 pt-6 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10"
                >
                    <div className="flex items-center gap-3 mb-1">
                        <Settings className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t("settings")}</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t("managePreferences")}
                    </p>
                </motion.div>
            </div>

            {/* Settings Content */}
            <div className="px-6 pb-8">
                <div className="max-w-2xl space-y-6">
                    {/* Account Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05, duration: 0.5 }}
                        className="glass-effect rounded-xl p-6 border border-primary/10"
                    >
                        <h3 className="font-semibold text-foreground mb-4">{t("accountSettings")}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">{t("emailAddress")}</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">{t("fullName")}</label>
                                <input
                                    type="text"
                                    value={user?.user_metadata?.full_name || user?.email?.split("@")[0] || ""}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Settings Sections */}
                    {settingsSections.map((section, sectionIdx) => (
                        <motion.div
                            key={section.titleKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + sectionIdx * 0.05, duration: 0.5 }}
                            className="glass-effect rounded-xl p-6 border border-primary/10"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <section.icon className={`w-5 h-5 ${section.color}`} />
                                <h3 className="font-semibold text-foreground">{section.title}</h3>
                            </div>
                            <div className="space-y-3">
                                {section.settings.map((setting) => (
                                    <div key={setting.id} className="flex items-center justify-between pb-3 border-b border-border/20 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{t(setting.labelKey)}</p>
                                            <p className="text-xs text-muted-foreground">{t(setting.descKey)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(setting.id)}
                                            className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none ${settings[setting.id as keyof typeof settings]
                                                ? "bg-indigo-600 shadow-lg shadow-indigo-500/30"
                                                : "bg-gray-300 dark:bg-gray-700"
                                                }`}
                                            aria-label={`Toggle ${t(setting.labelKey)}`}
                                            aria-pressed={settings[setting.id as keyof typeof settings]}
                                        >
                                            <motion.div
                                                animate={{
                                                    x: settings[setting.id as keyof typeof settings] ? 20 : 2,
                                                }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-0.5"
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Language Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="glass-effect rounded-xl p-6 border border-primary/10"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-orange-500" />
                            <h3 className="font-semibold text-foreground">{t("languageRegion")}</h3>
                        </div>
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-muted/30 dark:bg-gray-800 border border-border/30 dark:border-gray-700 text-foreground focus:outline-none focus:border-primary/50 dark:focus:border-indigo-500/50"
                        >
                            <option value="en">{t("english")}</option>
                            <option value="es">{t("spanish")}</option>
                            <option value="fr">{t("french")}</option>
                        </select>
                    </motion.div>

                    {/* Danger Zone - Logout */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                        className="glass-effect rounded-xl p-6 border border-red-500/20 bg-red-500/5"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <LogOut className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold text-foreground">{t("session")}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t("signOutDesc")}
                        </p>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                            {loading ? t("signingOut") : t("signOut")}
                        </button>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
