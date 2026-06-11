import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";

export const Footer = () => {
    const { t } = useTranslation()

    return (
        <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="relative w-36 h-12 mb-4">
                            <Image
                                src="/images/smart-parking.png"
                                alt="Smart parking"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="eager"
                            />
                        </div>
                        <p className="text-gray-400 text-sm">
                            {
                                t("landing.footerDesc")
                            }
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            {
                                t("landing.platform")
                            }
                        </h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <Link
                                    href="/owner/dashboard"
                                    className="hover:text-white transition-colors"
                                >
                                    {
                                        t("landing.ownerDashboard")
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link href="#">
                                    {
                                        t("landing.mobileApp")
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    {
                                        t("landing.premiumSubscriptions")
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            {
                                t("landing.support")
                            }
                        </h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    {
                                        t("landing.helpCenter")
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    {
                                        t("landing.contactUs")
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    {
                                        t("landing.privacyPolicy")
                                    }
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-white transition-colors"
                                >
                                    {
                                        t("landing.termsOfService")
                                    }
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>
                        {
                            t("landing.copyright")
                        }
                    </p>
                </div>
            </div>
        </footer>
    )
}
