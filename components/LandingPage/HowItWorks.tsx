import {
    Receipt,
    Smartphone,
    Truck
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export const HowItWorks = () => {
    const { t } = useTranslation()

    return (
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
                {
                    t("landing.howItWorks")
                }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Truck className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.ownerDashboardStep")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.ownerDashboardStepDesc")
                        }
                    </p>
                </div>
                <div className="text-center">
                    <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.mobileApp")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.mobileAppStepDesc")
                        }
                    </p>
                </div>
                <div className="text-center">
                    <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Receipt className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.seamlessOperations")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.seamlessOperationsDesc")
                        }
                    </p>
                </div>
            </div>
        </section>
    )
}
