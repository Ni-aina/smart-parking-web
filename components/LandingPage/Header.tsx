import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const Header = () => {
    const { t } = useTranslation()

    return (
        <nav className="flex flex-wrap justify-between items-center px-6 py-4 border-b border-white/10 gap-4">
            <div className="relative w-24 h-8 sm:w-36 sm:h-12">
                <Image
                    src="/images/smart-parking.png"
                    alt="Smart parking"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="eager"
                />
            </div>
            <div className="sm:hidden">
                <LanguageSwitcher />
            </div>
            <div className="flex flex-1 justify-between sm:justify-end items-center gap-6">
                <div className="hidden sm:block">
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
