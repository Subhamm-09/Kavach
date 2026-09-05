import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KAVACH — Full-Stack Agentic AI Safety Platform",
  description: "IIT Bhubaneswar Hackathon Master Implementation: Proactive Prevention, Trauma-Informed Response, and Privacy-Preserving Prosecution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-[#dbe2dc] bg-[#eef1eb] py-6 text-center text-xs text-[#65736f]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-[#17332f]">Kavach</span> • Proactive Urban Safety & Privacy Platform
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="text-[#167a5b] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1c9b73] inline-block"></span>
                <span>System: Operational</span>
              </span>
              <span>•</span><span className="text-[#006d62]">11 Agent Modules Configured</span><span>•</span><span className="text-[#397066]">Authority PII Boundary Active</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
