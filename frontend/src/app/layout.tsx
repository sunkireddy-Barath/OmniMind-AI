import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

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
  themeColor: "#111111",
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
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen mesh-gradient text-[var(--text-primary)]">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "rgba(247, 247, 247, 0.97)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "12px",
                  color: "#151515",
                  fontSize: "14px",
                  fontWeight: "600",
                },
                success: {
                  iconTheme: {
                    primary: "#111111",
                    secondary: "#f7f7f7",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#111111",
                    secondary: "#f7f7f7",
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
