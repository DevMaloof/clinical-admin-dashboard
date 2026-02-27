// /app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Eye, EyeOff, LogIn, Lock, Mail, Heart,
    Stethoscope, Shield, Activity, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StaffLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("Invalid credentials. Please check your email and password.");
            setLoading(false);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />

                {/* Medical cross pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(circle at 2px 2px, #0ea5e9 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }} />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Brand Header - Healthcare Version */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-xl opacity-50 animate-pulse" />
                            <div className="relative p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                                <Heart className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Maloof Health
                            </h1>
                            <p className="text-sm text-blue-200/60">Clinical Staff Portal</p>
                        </div>
                    </div>
                    <p className="text-blue-200/60 text-sm">Secure access to healthcare management systems</p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-2">
                            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                                <Shield className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Clinical Login
                        </CardTitle>
                        <CardDescription className="text-center text-blue-200/60">
                            Enter your credentials to access the healthcare dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <AlertDescription className="text-red-300">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-400" />
                                    Staff Email
                                </label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white/5 border-white/10 text-white h-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-blue-200/40"
                                        placeholder="staff@maloofhealth.com"
                                        required
                                        disabled={loading}
                                    />
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-blue-400" />
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white h-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-blue-200/40"
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400/60 hover:text-blue-300 transition-colors disabled:opacity-50"
                                        disabled={loading}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-blue-200/60">Secure Connection</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3 w-3 text-emerald-400" />
                                        <span className="text-xs text-blue-200/60">256-bit Encryption</span>
                                    </div>
                                </div>
                            </div>

                            {/* MFA Notice */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-xs text-blue-200/80 flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-blue-400" />
                                    <span>Multi-factor authentication is enabled for all clinical staff accounts.</span>
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Authenticating...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <LogIn className="h-5 w-5" />
                                        Access Clinical Dashboard
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3">
                        <div className="text-center">
                            <p className="text-sm text-blue-200/40">
                                ⚕️ For security reasons, access is restricted to authorized clinical staff only.
                            </p>
                        </div>
                        <div className="w-full border-t border-white/10 pt-4">
                            <div className="flex items-center justify-center gap-4 text-xs text-blue-200/40">
                                <div className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" />
                                    <span>HIPAA Compliant</span>
                                </div>
                                <div className="h-3 w-px bg-white/10" />
                                <div className="flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3" />
                                    <span>Clinical Staff Only</span>
                                </div>
                                <div className="h-3 w-px bg-white/10" />
                                <div className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    <span>Audit Logged</span>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-blue-200/30">
                        For technical support, contact the IT department at{" "}
                        <span className="text-blue-400">it-support@maloofhealth.com</span>
                    </p>
                    <p className="text-xs text-blue-200/30 mt-1">
                        All access is monitored and logged for security purposes.
                    </p>
                </div>
            </div>
        </div>
    );
}