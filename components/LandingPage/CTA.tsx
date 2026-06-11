import { Smartphone } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export const CTA = ({
    handleDownload
}: {
    handleDownload: () => void
}) => {
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
                >
                    <Smartphone size={24} />
                    <span>
                        {
                            t("landing.downloadAndroidApp")
                        }
                    </span>
                </button>
                <Link
                    href="/owner/dashboard"
                    className="bg-white text-black px-8 py-4 rounded-xl hover:opacity-80 transition-opacity shadow-lg"
                >
                    {
                        t("landing.ownerAccess")
                    }
                </Link>
            </div>
        </section>
    )
}
