import { useTranslation } from "@/context/LanguageContext";

export const LanguageSwitcher = () => {
    const { language, setLanguage } = useTranslation()

    return (
        <div className="relative flex items-center bg-white/10 border border-white/10 rounded-full p-0.5 w-18 h-7 select-none">
            <button
                type="button"
                onClick={() => {
                    setLanguage("en")
                }}
                className={`
                    relative z-10 w-1/2 h-full text-[10px] font-semibold rounded-full transition-colors duration-300
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
                    relative z-10 w-1/2 h-full text-[10px] font-semibold rounded-full transition-colors duration-300
                    ${language === "fr" ? "text-black" : "text-white/60 cursor-pointer hover:text-white"}
                `}
            >
                FR
            </button>
            <div
                className={`
                    absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white rounded-full transition-all duration-300 ease-out
                    ${language === "en" ? "left-0.5" : "left-[calc(50%+1px)]"}
                `}
            />
        </div>
    )
}
