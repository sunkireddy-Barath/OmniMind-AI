import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CursorGlow from "@/components/ui/CursorGlow";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OmniMind AI - Autonomous Multi-Agent AI Platform",
  description:
    "Transform complex problems into structured solutions using collaborative AI agents. Get verified knowledge, scenario simulations, and consensus-driven recommendations.",
  keywords:
    "AI, artificial intelligence, multi-agent, decision making, simulation, automation",
  authors: [{ name: "OmniMind AI Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <CursorGlow />
          <div className="min-h-screen mesh-gradient text-[var(--text-primary)]">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "rgba(18, 18, 18, 0.92)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  fontWeight: "600",
                },
                success: {
                  iconTheme: {
                    primary: "#FFFFFF",
                    secondary: "#0A0A0A",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#FFFFFF",
                    secondary: "#0A0A0A",
                  },
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
