import { useTranslation } from "@/context/LanguageContext";

export const LanguageSwitcher = () => {
    const { language, setLanguage } = useTranslation()

    return (
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 w-24 h-9 select-none">
            <button
                type="button"
                onClick={() => {
                    setLanguage("en")
                }}
                className={`
                    relative z-10 w-1/2 h-full text-xs font-semibold rounded-full transition-colors duration-300
                    ${language === "en" ? "text-black" : "text-white/60 cursor-pointer hover:text-white"}
                `}
            >
                EN
            </button>

            <button
                type="button"
                onClick={() => {
                    setLanguage("fr")
                }}
                className={`
                    relative z-10 w-1/2 h-full text-xs font-semibold rounded-full transition-colors duration-300
                    ${language === "fr" ? "text-black" : "text-white/60 cursor-pointer hover:text-white"}
                `}
            >
                FR
            </button>
            <div
                className={`
                    absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-all duration-300 ease-out
                    ${language === "en" ? "left-1" : "left-[calc(50%+2px)]"}
                `}
            />
        </div>
    )
}
