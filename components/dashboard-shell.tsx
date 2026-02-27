// /components/dashboard-shell.tsx
"use client";

import React, { useState } from "react";
import { Menu, Heart } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import ProfileDialog from "./profiledialog";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Sidebar */}
            <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Top Navigation Bar - Healthcare Style */}
                <header className="sticky top-0 z-40 h-16 px-6 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    {/* Left: Menu button + Brand */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                            aria-label="Open sidebar"
                        >
                            <Menu className="w-5 h-5 text-blue-200" />
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Maloof Health
                                </h1>
                                <p className="text-xs text-blue-200/60">Admin Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Profile */}
                    <div className="flex items-center gap-3">
                        <ProfileDialog />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Subtle background pattern */}
                        <div className="relative">
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: "radial-gradient(circle at 2px 2px, #0ea5e9 1px, transparent 1px)",
                                    backgroundSize: "40px 40px"
                                }} />
                            </div>
                            {children}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-white/5 mt-auto">
                    <div className="px-6 py-3">
                        <div className="flex items-center justify-between text-xs text-blue-200/30">
                            <div className="flex items-center gap-2">
                                <Heart className="h-3 w-3" />
                                <span>Maloof Health Systems - Clinical Admin</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>HIPAA Compliant</span>
                                <span>Secure Session</span>
                                <span>v2.0.0</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}