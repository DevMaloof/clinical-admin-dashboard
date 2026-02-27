// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Heart } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maloof Health - Admin Dashboard",
  description: "Healthcare administration portal for managing appointments, patients, and clinical operations.",
  keywords: ["healthcare admin", "patient management", "appointment scheduling", "medical dashboard", "clinic management"],
  authors: [{ name: "Maloof Health Systems" }],
  creator: "Maloof Health Systems",
  publisher: "Maloof Health Systems",
  openGraph: {
    title: "Maloof Health - Admin Portal",
    description: "Healthcare administration dashboard for clinical staff",
    images: ["/healthcare-admin-og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/healthcare-favicon.ico" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen`}
      >
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #0ea5e9 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <Providers>{children}</Providers>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-xs text-blue-200/40">
              <div className="flex items-center gap-2">
                <Heart className="h-3 w-3" />
                <span>Maloof Health Systems - Clinical Admin Portal</span>
              </div>
              <div className="flex items-center gap-4">
                <span>HIPAA Compliant</span>
                <span>Secure Access</span>
                <span>v2.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}