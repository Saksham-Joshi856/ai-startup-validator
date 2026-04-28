import { motion } from "framer-motion";
import { Settings, Bell, Shield, Moon, Globe, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useTheme } from "@/hooks/use-theme";

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        darkMode: theme === "dark",
        analytics: true,
        language: "en",
    });
    const [loading, setLoading] = useState(false);

    const handleToggle = (key: string) => {
        if (key === "darkMode") {
            toggleTheme();
        }
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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
            title: "Notifications",
            icon: Bell,
            color: "text-blue-500",
            settings: [
                {
                    id: "emailNotifications",
                    label: "Email Notifications",
                    description: "Receive email updates about your validations",
                },
                {
                    id: "pushNotifications",
                    label: "Push Notifications",
                    description: "Get push alerts for important updates",
                },
            ],
        },
        {
            title: "Appearance",
            icon: Moon,
            color: "text-purple-500",
            settings: [
                {
                    id: "darkMode",
                    label: "Dark Mode",
                    description: "Use dark theme for the application",
                },
            ],
        },
        {
            title: "Privacy & Security",
            icon: Shield,
            color: "text-green-500",
            settings: [
                {
                    id: "analytics",
                    label: "Analytics Tracking",
                    description: "Allow us to collect anonymous usage data",
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
                        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Settings</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage your account preferences and application settings
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
                        <h3 className="font-semibold text-foreground mb-4">Account Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
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
                            key={section.title}
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
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</p>
                                            <p className="text-xs text-muted-foreground">{setting.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(setting.id)}
                                            className={`w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none ${settings[setting.id as keyof typeof settings]
                                                ? "bg-indigo-600 shadow-lg shadow-indigo-500/30"
                                                : "bg-gray-300 dark:bg-gray-700"
                                                }`}
                                            aria-label={`Toggle ${setting.label}`}
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
                            <h3 className="font-semibold text-foreground">Language & Region</h3>
                        </div>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-muted/30 dark:bg-gray-800 border border-border/30 dark:border-gray-700 text-foreground focus:outline-none focus:border-primary/50 dark:focus:border-indigo-500/50"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ja">Japanese</option>
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
                            <h3 className="font-semibold text-foreground">Session</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Sign out from your account on this device
                        </p>
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Signing out..." : "Sign Out"}
                        </button>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
