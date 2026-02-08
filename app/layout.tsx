import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import { Toaster } from "sonner";

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
          bg-black/95
          antialiased
        `}
      >
        <AuthContextProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </AuthContextProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              color: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(10px)",
              padding: "12px"
            }
          }}
        />
      </body>
    </html>
  )
}

export default RootLayout;