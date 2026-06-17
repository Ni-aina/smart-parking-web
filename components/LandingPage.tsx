"use client";

import { downloadFile } from "@/utils/download";
import { toast } from "sonner";
import { Header } from "./LandingPage/Header";
import { Hero } from "./LandingPage/Hero";
import { Features } from "./LandingPage/Features";
import { HowItWorks } from "./LandingPage/HowItWorks";
import { Architecture } from "./LandingPage/Architecture";
import { CTA } from "./LandingPage/CTA";
import { Footer } from "./LandingPage/Footer";

const APK_URL = "https://files.catbox.moe/djl52t.apk"

const LandingPage = () => {

    const handleDownload = async () => {
        toast.loading("Starting download...", {
            id: "apk-download"
        })

        try {
            const totalMB = await downloadFile(
                APK_URL,
                "Smart-Parking.apk",
                (receivedMB, totalMB, percent, speed, timeLeft) => {
                    toast.loading(
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">Smart-Parking.apk - {percent}%</span>
                            <span className="text-sm">{receivedMB} MB / {totalMB} MB - {speed} - {timeLeft}</span>
                        </div>,
                        {
                            id: "apk-download"
                        }
                    )
                }
            )

            toast.success(`Download complete! (${totalMB} MB)`, {
                id: "apk-download"
            })
        } catch {
            toast.error("Download failed. Please try again.", {
                id: "apk-download"
            })
        }
    }

    return (
        <div className="min-h-screen bg-black/95">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16">
                <Hero
                    handleDownload={handleDownload}
                />
                <Features />
                <HowItWorks />
                <Architecture />
                <CTA
                    handleDownload={handleDownload}
                />
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage
