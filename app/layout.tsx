import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";
import { AuthContextProvider } from "../components/Authentication/Authentication"; 
 
const inter = Inter({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthContextProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}