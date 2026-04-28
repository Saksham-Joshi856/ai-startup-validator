import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Lightbulb,
    FileText,
    Bot,
    Settings,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const navItems = [
        { icon: LayoutDashboard, labelKey: "dashboard", path: "/" },
        { icon: Lightbulb, labelKey: "validate", path: "/validate" },
        { icon: FileText, labelKey: "reports", path: "/reports" },
        { icon: Bot, labelKey: "advisor", path: "/advisor" },
        { icon: Settings, labelKey: "settings", path: "/settings" },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 h-20 bg-surface-primary/80 backdrop-blur-md border-t border-default flex items-center justify-around px-2 z-50 md:hidden"
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                    <motion.button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-lg relative"
                    >
                        {/* Active indicator */}
                        {active && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="absolute inset-0 bg-primary/10 rounded-lg"
                            />
                        )}

                        {/* Icon */}
                        <Icon
                            className={`w-6 h-6 relative z-10 transition-colors duration-200 ${active
                                ? "text-primary"
                                : "text-muted"
                                }`}
                        />

                        {/* Label */}
                        <span
                            className={`text-[10px] font-medium relative z-10 transition-colors duration-200 label-sm ${active
                                ? "text-primary"
                                : "text-muted"
                                }`}
                        >
                            {t(item.labelKey)}
                        </span>
                    </motion.button>
                );
            })}
        </motion.nav>
    );
}
