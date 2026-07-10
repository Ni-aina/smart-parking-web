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
import { useEffect, useRef } from "react";
import { useTranslation } from "@/context/LanguageContext";

const APK_URL = "https://files.catbox.moe/vox3na.apk";

const LandingPage = () => {

    const { t, language } = useTranslation();
    const isDownloading = useRef(false);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isDownloading.current) return;
            e.preventDefault();
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    const handleDownload = async () => {
        toast.loading(t("landing.downloadStarting"), {
            id: "apk-download"
        })

        isDownloading.current = true;

        try {
            const totalMB = await downloadFile(
                APK_URL,
                "Smart-Parking.apk",
                language,
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

            toast.success(t("landing.downloadComplete", { totalMB }), {
                id: "apk-download"
            })
        } catch {
            toast.error(t("landing.downloadFailed"), {
                id: "apk-download"
            })
        } finally {
            isDownloading.current = false
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

export default LandingPage;