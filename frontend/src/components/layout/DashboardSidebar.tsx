import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  Bot,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Lightbulb, label: "Validate Idea", path: "/validate" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Bot, label: "AI Advisor", path: "/advisor" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-default bg-surface-primary">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-subtle">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm">AI</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-primary heading-sm">AI Validator</span>
          <span className="text-[11px] text-muted label-sm">Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {/* Active background */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover background */}
              <div className={`absolute inset-0 rounded-lg transition-colors duration-200 ${active ? "" : "hover:bg-surface-secondary"
                }`} />

              {/* Icon */}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors duration-200 ${active
                  ? "text-primary"
                  : "text-muted hover:text-secondary"
                  }`}
              />

              {/* Label */}
              <span
                className={`relative z-10 transition-colors duration-200 ${active
                  ? "text-primary font-semibold"
                  : "text-muted"
                  }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-subtle">
        <div className="rounded-lg bg-surface-secondary p-3">
          <p className="text-xs font-semibold text-primary label-sm mb-2">Pro Plan</p>
          <p className="text-xs text-muted label-sm mb-2">2,847 / 5,000 validations</p>
          <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "57%" }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
