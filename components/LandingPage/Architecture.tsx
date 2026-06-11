import { Star } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export const Architecture = () => {
    const { t } = useTranslation()

    return (
        <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
                {
                    t("landing.platformArchitecture")
                }
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-4">
                            {
                                t("landing.roleAccessSystem")
                            }
                        </h3>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.ownersAccess")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.agentsAccess")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.driversAccess")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.subRevenue")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.dimManagement")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.agentPermissions")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.transHistory")
                                    }
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                <span>
                                    {
                                        t("landing.bankIntegration")
                                    }
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                        <h4 className="text-xl font-semibold text-white mb-4">
                            {
                                t("landing.systemFeatures")
                            }
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-400">3</div>
                                <div className="text-sm text-gray-300">
                                    {
                                        t("landing.userRoles")
                                    }
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">2</div>
                                <div className="text-sm text-gray-300">
                                    {
                                        t("landing.platforms")
                                    }
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-400">100%</div>
                                <div className="text-sm text-gray-300">
                                    {
                                        t("landing.stripeIntegration")
                                    }
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-400">24/7</div>
                                <div className="text-sm text-gray-300">
                                    {
                                        t("landing.monitoring")
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
