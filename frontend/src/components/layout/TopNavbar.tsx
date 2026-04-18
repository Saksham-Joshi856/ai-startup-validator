import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Sun, Moon, Sparkles, LogOut, Settings } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const userEmail = user?.email || "User";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="h-14 border-b border-border/30 bg-card/20 backdrop-blur-2xl flex items-center justify-between px-6 z-10">
      {/* Search */}
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search ideas, reports..."
          className="w-full h-9 pl-10 pr-16 rounded-xl bg-muted/30 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-300"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded-md border border-border/30">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* AI Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 mr-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ai-badge-glow" />
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-semibold text-primary">AI Online</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-accent ai-badge-glow border-2 border-card" />
        </motion.button>

        {/* User Avatar Dropdown */}
        <div className="relative ml-1">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent cursor-pointer ring-2 ring-primary/20 ring-offset-2 ring-offset-background overflow-hidden"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border/50 shadow-xl z-50"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border/30">
                <p className="text-sm font-semibold text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  navigate("/settings");
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center gap-2 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors duration-200 border-t border-border/30"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
