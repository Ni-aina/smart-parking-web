import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export const CTA = () => {
    const { t } = useTranslation()

    return (
        <section className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-6">
                {
                    t("landing.readyToStart")
                }
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {
                    t("landing.readyToStartDesc")
                }
            </p>
            <div className="flex justify-center">
                <Link
                    href="/owner/dashboard"
                    className="w-full sm:w-xs bg-white text-black py-4 rounded-xl hover:opacity-80 transition-opacity shadow-lg"
                >
                    {
                        t("landing.getStarted")
                    }
                </Link>
            </div>
        </section>
    )
}
