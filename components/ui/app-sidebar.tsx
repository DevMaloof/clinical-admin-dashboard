// /components/ui/app-sidebar.tsx
"use client";

import Link from "next/link";
import {
    Home,
    ScrollText,
    Mail,
    Heart,
    User,
    X,
    NotebookText,
    NotebookPen,
    Settings,
    LogOut,
    Users,
    ChevronRight,
    Activity,
    Stethoscope,
    Shield,
    Calendar,
    FileText,
    Award,
    Clock,
    AlertCircle,
    Pill,
    Microscope
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {
    open?: boolean;
    onClose?: () => void;
};

export function AppSidebar({ open = false, onClose }: Props) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const role = session?.user?.role || "employee";

    const mainItems = [
        { title: "Dashboard", url: "/", icon: Home },
        { title: "Appointments", url: "/appointments", icon: Calendar },
        { title: "Subscribers", url: "/subscriptions", icon: Users },
        { title: "Messages", url: "/offers", icon: Mail },
        { title: "Feedback", url: "/feedback", icon: FileText },
    ];

    const adminItems = [
        { title: "Staff Management", url: "/staff", icon: Stethoscope },
    ];

    const getActiveClass = (url: string) => {
        if (url === "/" && pathname === "/") return true;
        if (url !== "/" && pathname.startsWith(url)) return true;
        return false;
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    // Get role display name
    const getRoleDisplay = () => {
        switch (role) {
            case "director":
                return { title: "Medical Director", icon: <Award className="w-4 h-4 text-blue-400" /> };
            case "employee":
                return { title: "Clinical Staff", icon: <Stethoscope className="w-4 h-4 text-emerald-400" /> };
            case "admin":
                return { title: "System Admin", icon: <Shield className="w-4 h-4 text-purple-400" /> };
            default:
                return { title: "Staff", icon: <User className="w-4 h-4 text-gray-400" /> };
        }
    };

    const roleDisplay = getRoleDisplay();

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="relative z-50 flex flex-col h-full w-80 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-r border-white/10 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-50" />
                                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                            Maloof Health
                                        </h1>
                                        <p className="text-xs text-blue-200/60">Clinical Portal</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition"
                                    aria-label="Close sidebar"
                                >
                                    <X className="w-5 h-5 text-blue-200/60" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                            <span className="text-lg font-bold text-white">
                                                {session?.user?.name?.charAt(0) || "U"}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-slate-900"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-white truncate">
                                            {session?.user?.name || "User"}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {roleDisplay.icon}
                                            <p className="text-xs text-blue-200/60">
                                                {roleDisplay.title}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-blue-200/40" />
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                            {/* Main Navigation */}
                            <div className="space-y-1 mb-8">
                                <p className="px-3 text-xs font-semibold text-blue-200/40 uppercase tracking-wider mb-3">
                                    Main
                                </p>
                                {mainItems.map((item) => {
                                    const isActive = getActiveClass(item.url);
                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.url}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                                                : "text-blue-200/60 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                                                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-blue-200/60'}`} />
                                            </div>
                                            <span className="font-medium flex-1">{item.title}</span>
                                            {isActive && (
                                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Admin Navigation (for directors and admins) */}
                            {(role === "director" || role === "admin") && (
                                <div className="space-y-1 mb-8">
                                    <p className="px-3 text-xs font-semibold text-blue-200/40 uppercase tracking-wider mb-3">
                                        Administration
                                    </p>
                                    {adminItems.map((item) => {
                                        const isActive = getActiveClass(item.url);
                                        return (
                                            <Link
                                                key={item.title}
                                                href={item.url}
                                                onClick={onClose}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                                                    : "text-blue-200/60 hover:text-white hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${isActive ? 'bg-purple-500/20' : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
                                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-blue-200/60'}`} />
                                                </div>
                                                <span className="font-medium flex-1">{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 hover:bg-rose-500/20 text-blue-200/60 hover:text-rose-400 transition-all duration-200 border border-white/10 hover:border-rose-500/30 group"
                            >
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-rose-500/20 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <span className="font-medium flex-1 text-left">Sign Out</span>
                                <Activity className="w-4 h-4 text-blue-200/40 group-hover:text-rose-400" />
                            </button>

                            <div className="mt-6 px-3 text-center">
                                <p className="text-xs text-blue-200/30">
                                    © {new Date().getFullYear()} Maloof Health Systems
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <Shield className="w-3 h-3 text-emerald-500/50" />
                                    <span className="text-[10px] text-blue-200/30">HIPAA Compliant</span>
                                    <span className="w-1 h-1 rounded-full bg-blue-200/20" />
                                    <span className="text-[10px] text-blue-200/30">v2.0.0</span>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}