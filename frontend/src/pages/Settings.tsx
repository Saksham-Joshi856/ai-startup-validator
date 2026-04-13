import { motion } from "framer-motion";
import { Settings } from "lucide-react";

const SettingsPage = () => {
    return (
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

            <div className="mt-8 grid gap-6 max-w-2xl">
                <div className="glass-effect rounded-xl p-6 border border-primary/10 space-y-4">
                    <h3 className="font-semibold text-foreground">Account Settings</h3>
                    <div className="space-y-4">
                        <div className="pb-4 border-b border-border/30">
                            <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                            />
                        </div>
                        <div className="pb-4 border-b border-border/30">
                            <label className="text-sm font-medium text-foreground block mb-2">Notifications</label>
                            <div className="flex items-center">
                                <input type="checkbox" id="notifications" defaultChecked className="w-4 h-4" />
                                <label htmlFor="notifications" className="ml-2 text-sm text-muted-foreground">
                                    Receive email notifications
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors">
                        Save Changes
                    </button>
                    <button className="px-6 py-2 rounded-lg bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
