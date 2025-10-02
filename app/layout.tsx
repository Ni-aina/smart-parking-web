import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import ReactQueryProvider from "@/context/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Smart Parking",
  description: "Smart Parking Admin Dashboard for managing parking spaces, reservations, and user access.",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          bg-slate-950
          antialiased
        `}
      >
        <AuthContextProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </AuthContextProvider>
      </body>
    </html>
  )
}

export default RootLayout;