// /app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert, Lock, Home, AlertTriangle,
  Shield, AlertCircle, LogIn} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="relative">
          {/* Background effects */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />

          {/* Main card */}
          <Card className="relative border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center">
                  <ShieldAlert className="h-12 w-12 text-white" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent mb-4">
                Access Restricted
              </h1>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
                <AlertTriangle className="h-5 w-5 text-rose-400" />
                <span className="text-rose-300 font-medium">Unauthorized Access Attempt</span>
              </div>

              <p className="text-blue-200 text-lg mb-2">
                You don't have permission to access this clinical area.
              </p>
              <p className="text-blue-200/60 text-sm max-w-md mx-auto">
                This area is restricted to authorized healthcare staff only. All access attempts are logged for security purposes.
              </p>
            </div>

            {/* Status indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/20">
                    <Lock className="h-5 w-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200/60">Security Level</p>
                    <p className="font-semibold text-white">HIPAA Restricted</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200/60">Access Required</p>
                    <p className="font-semibold text-white">Clinical Credentials</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200/60">Authentication</p>
                    <p className="font-semibold text-white">Role-Based Access</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/login" className="block">
                <Button
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <div className="flex items-center justify-center gap-3">
                    <LogIn className="h-5 w-5" />
                    <span>Clinical Staff Login</span>
                  </div>
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full h-14 text-lg border-white/10 text-blue-200 hover:text-white hover:bg-white/5"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Home className="h-5 w-5" />
                    <span>Return to Home</span>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Additional info */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-blue-200/40">Need assistance?</p>
                  <p className="text-sm text-blue-400 font-medium">
                    Contact: security@maloofhealth.com
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200/40">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>HIPAA compliant • 256-bit encryption</span>
                </div>
              </div>
            </div>

            {/* Logged attempt warning */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-400/80 flex items-center gap-2">
                <AlertCircle className="h-3 w-3" />
                <span>This unauthorized access attempt has been logged. Repeated attempts will be reported.</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-200/20">
            Maloof Health Systems • Protected Health Information • Confidential
            <br />
            For assistance, please contact your system administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
}