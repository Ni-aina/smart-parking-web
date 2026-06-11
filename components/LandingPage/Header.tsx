import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const Header = () => {
    const { t } = useTranslation()

    return (
        <nav className="grid grid-cols-1 lg:grid-cols-2 px-6 py-4 border-b border-white/10 gap-4">
            <div className="flex justify-between items-center gap-5">
                <div className="relative w-24 h-8 sm:w-36 sm:h-12">
                    <Image
                        src="/images/smart-parking.png"
                        alt="Smart parking"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="eager"
                    />
                </div>
                <div className="lg:hidden">
                    <LanguageSwitcher />
                </div>
            </div>
            <div className="flex justify-end items-center gap-6">
                <div className="hidden lg:block">
                    <LanguageSwitcher />
                </div>
                <Link
                    href="/auth/sign-in"
                    className="text-white hover:text-blue-400 transition-colors"
                >
                    {
                        t("landing.signIn")
                    }
                </Link>
                <Link
                    href="/auth/sign-up"
                    className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {
                        t("landing.getStarted")
                    }
                </Link>
            </div>
        </nav>
    )
}
