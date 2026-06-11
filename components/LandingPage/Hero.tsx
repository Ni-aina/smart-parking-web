import { Smartphone } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export const Hero = ({
    handleDownload
}: {
    handleDownload: () => void
}) => {
    const { t } = useTranslation()

    return (
        <section className="text-center mb-20">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {
                    t("landing.title")
                }
                <span className="block text-blue-400">
                    {
                        t("landing.subtitle")
                    }
                </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                {
                    t("landing.description")
                }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl cursor-pointer hover:opacity-80 transition-opacity shadow-lg"
                >
                    <Smartphone size={24} />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {
                                t("landing.downloadAndroid")
                            }
                        </span>
                        <h1 className="text-lg font-bold">Android</h1>
                    </div>
                </button>
                <Link
                    href="/owner/dashboard"
                    className="bg-white text-black px-8 py-4 rounded-xl hover:opacity-80 transition-opacity shadow-lg"
                >
                    {
                        t("landing.ownerDashboard")
                    }
                </Link>
            </div>
        </section>
    )
}
