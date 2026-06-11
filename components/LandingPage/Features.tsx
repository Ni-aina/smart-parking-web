import {
    Crown,
    FileText,
    Truck,
    UserCheck,
    Wrench
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export const Features = () => {
    const { t } = useTranslation()

    return (
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
                {
                    t("landing.keyFeatures")
                }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <Truck className="text-blue-400 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.vehicleManagement")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.vehicleManagementDesc")
                        }
                    </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <Crown className="text-yellow-400 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.premiumSubscriptions")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.premiumSubscriptionsDesc")
                        }
                    </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <Wrench className="text-orange-400 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.maintenanceTracking")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.maintenanceTrackingDesc")
                        }
                    </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <FileText className="text-purple-400 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.digitalReceipts")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.digitalReceiptsDesc")
                        }
                    </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <UserCheck className="text-cyan-400 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.agentSystem")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.agentSystemDesc")
                        }
                    </p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <Wrench className="text-red-400 mb-4" size={32} />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {
                            t("landing.vehicleTypes")
                        }
                    </h3>
                    <p className="text-gray-300">
                        {
                            t("landing.vehicleTypesDesc")
                        }
                    </p>
                </div>
            </div>
        </section>
    )
}
