import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  TrendingUp,
  Bot,
  Settings,
  ChevronLeft,
  Sparkles,
  Zap,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Lightbulb, label: "Validate Idea", path: "/validate", badge: "New" },
  { icon: FileText, label: "My Reports", path: "/reports", badge: "3" },
  { icon: TrendingUp, label: "Market Insights", path: "/insights", badge: null },
  { icon: Bot, label: "AI Advisor", path: "/advisor", badge: "AI" },
  { icon: Settings, label: "Settings", path: "/settings", badge: null },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveIndex = () => {
    return navItems.findIndex(item => item.path === location.pathname);
  };

  const activeIndex = getActiveIndex() !== -1 ? getActiveIndex() : 0;

  return (
    <motion.aside
      layout
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-screen flex flex-col border-r border-border/30 bg-card/40 backdrop-blur-2xl z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/30">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 5 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 ai-badge-glow"
        >
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </motion.div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-sm gradient-text whitespace-nowrap">AI Validator</span>
              <span className="block text-[10px] text-muted-foreground font-medium -mt-0.5">Pro Edition</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map((item, i) => (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.path)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${activeIndex === i
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {activeIndex === i && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_-4px_hsl(var(--glow-primary)/0.3)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {activeIndex !== i && (
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 bg-muted/30 transition-opacity duration-200"
              />
            )}
            <item.icon className="w-5 h-5 shrink-0 relative z-10" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between flex-1 relative z-10 overflow-hidden"
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap ${item.badge === "AI"
                      ? "bg-accent/20 text-accent ai-badge-glow"
                      : item.badge === "New"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>

      {/* Bottom section */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-4"
          >
            <div className="gradient-border-card rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-foreground">Pro Plan</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">2,847 / 5,000 validations used</p>
              <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "57%" }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 rounded-full border border-border/50 bg-card shadow-lg flex items-center justify-center hover:bg-muted hover:scale-110 transition-all duration-200"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </button>
    </motion.aside>
  );
}
