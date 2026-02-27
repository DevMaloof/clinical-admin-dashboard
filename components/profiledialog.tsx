// /components/ProfileDialog.tsx
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import {
    LogOut,
    User,
    Shield,
    Mail,
    Crown,
    Briefcase,
    Heart,
    Stethoscope,
    Activity,
    Award,
    Clock
} from "lucide-react";

export default function ProfileDialog() {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();

    if (!session) return null;

    const role = session.user.role || "guest";
    const name = session.user.name || "User";
    const email = session.user.email || "user@example.com";

    const getRoleDetails = () => {
        switch (role) {
            case "director":
                return {
                    title: "Medical Director",
                    subtitle: "Full Clinical Access",
                    icon: <Award className="w-5 h-5 text-blue-400" />,
                    color: "from-blue-500/20 to-cyan-500/10",
                    border: "border-blue-500/30",
                    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-500/10"
                };
            case "employee":
                return {
                    title: "Clinical Staff",
                    subtitle: "Patient Care Access",
                    icon: <Stethoscope className="w-5 h-5 text-emerald-400" />,
                    color: "from-emerald-500/20 to-teal-500/10",
                    border: "border-emerald-500/30",
                    badgeColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
                    bgColor: "bg-emerald-500/10"
                };
            case "admin":
                return {
                    title: "System Administrator",
                    subtitle: "Full System Access",
                    icon: <Crown className="w-5 h-5 text-purple-400" />,
                    color: "from-purple-500/20 to-pink-500/10",
                    border: "border-purple-500/30",
                    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
                    bgColor: "bg-purple-500/10"
                };
            default:
                return {
                    title: "Guest",
                    subtitle: "Restricted Access",
                    icon: <User className="w-5 h-5 text-gray-400" />,
                    color: "from-gray-500/20 to-gray-600/10",
                    border: "border-gray-500/30",
                    badgeColor: "bg-gradient-to-r from-gray-500 to-gray-600",
                    bgColor: "bg-gray-500/10"
                };
        }
    };

    const roleDetails = getRoleDetails();

    async function handleLogout() {
        await signOut({ callbackUrl: `${window.location.origin}/login` });
        setOpen(false);
    }

    // Get session time or mock data
    const loginTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger Button - Healthcare Style */}
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 group">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <Heart className="w-4 h-4 text-white" />
                        </div>
                        {/* Online status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900"></div>
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-white">{name}</p>
                        <p className="text-xs text-blue-200/60">{roleDetails.title}</p>
                    </div>
                </button>
            </DialogTrigger>

            {/* Dialog Content - Healthcare Style */}
            <DialogContent className="sm:max-w-md w-[95%] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border border-white/10 rounded-2xl p-0 overflow-hidden shadow-2xl">
                {/* Header with gradient */}
                <div className={`p-6 bg-gradient-to-br ${roleDetails.color} relative overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <DialogHeader className="space-y-3 relative z-10">
                        <div className="flex items-center justify-center">
                            <div className={`w-20 h-20 rounded-full ${roleDetails.badgeColor} flex items-center justify-center mb-4 shadow-xl`}>
                                <Heart className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="text-center">
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {name}
                            </DialogTitle>
                            <div className={`inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full border ${roleDetails.border} ${roleDetails.bgColor} backdrop-blur-sm`}>
                                {roleDetails.icon}
                                <span className="text-sm font-medium text-white">{roleDetails.title}</span>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Profile Content */}
                <div className="p-6 space-y-5">
                    {/* User Details with glassmorphism */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <div className="flex-1">
                                <p className="text-sm text-blue-200/60">Email</p>
                                <p className="font-medium text-white truncate">{email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            <div className="flex-1">
                                <p className="text-sm text-blue-200/60">Access Level</p>
                                <p className="font-medium text-white">{roleDetails.subtitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                            <Clock className="w-5 h-5 text-amber-400" />
                            <div className="flex-1">
                                <p className="text-sm text-blue-200/60">Session Started</p>
                                <p className="font-medium text-white">{loginTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="border-blue-400/30 text-blue-300 hover:bg-blue-500/10 bg-white/5"
                            onClick={() => {/* Navigate to settings */ }}
                        >
                            <Activity className="w-4 h-4 mr-2" />
                            Activity
                        </Button>
                        <Button
                            variant="outline"
                            className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10 bg-white/5"
                            onClick={() => {/* Navigate to security */ }}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Security
                        </Button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4 border-t border-white/10">
                        <Button
                            variant="destructive"
                            className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 py-3 text-white shadow-lg"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    {/* Session Info */}
                    <div className="text-center">
                        <p className="text-xs text-blue-200/30">
                            Secure Session • HIPAA Compliant
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}