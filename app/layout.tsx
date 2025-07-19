import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import GitHubButton from "./components/GitHubButton";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedReports AI - Medical Report Analysis",
  description: "AI-powered medical report analysis and simplification tool",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <GitHubButton />
        </AuthProvider>
      </body>
    </html>
  );
}
