import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Sun, Moon, LogOut, Settings } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEmail = user?.email || "User";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setShowDropdown(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 h-16 border-b border-default bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 z-40">
      {/* Logo - visible on mobile */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">AI</span>
        </div>
        <span className="font-semibold text-sm text-primary heading-sm">Validator</span>
      </div>

      {/* Search bar - visible only on desktop */}
      <div className="hidden md:block relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-secondary border border-subtle text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-secondary text-muted hover:text-secondary transition-colors duration-200"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-secondary text-muted hover:text-secondary transition-colors duration-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
        </motion.button>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200 ${showDropdown
              ? "ring-2 ring-primary/50 bg-primary"
              : "bg-primary hover:bg-primary/90"
              }`}
            title={userName}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.92 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-64 rounded-lg bg-surface-primary border border-default shadow-xl z-50 overflow-hidden"
              >
                {/* User Info Header */}
                <div className="px-4 py-4 bg-surface-secondary border-b border-subtle">
                  <p className="text-sm font-semibold text-primary">{userName}</p>
                  <p className="text-xs text-muted mt-0.5">{userEmail}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => handleNavigation("/settings")}
                    className="w-full px-4 py-2.5 text-sm text-secondary hover:bg-surface-secondary flex items-center gap-3 transition-colors duration-150 active:bg-surface-tertiary"
                  >
                    <Settings className="w-4 h-4 text-muted" />
                    <span>Settings</span>
                  </button>

                  <div className="my-1 border-t border-subtle" />

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-3 transition-colors duration-150 active:bg-destructive/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
