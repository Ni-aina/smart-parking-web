"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";
import { translations } from "@/utils/translations/translations";

type Language = "en" | "fr";

interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export const LanguageProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const [language, setLanguage] = useState<Language>("en")

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language
        if (savedLanguage) {
            setLanguage(savedLanguage)
        } else {
            const browserLang = navigator.language.split("-")[0]
            if (browserLang === "fr" || browserLang === "en") {
                setLanguage(browserLang as Language)
            }
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("language", lang)
    }

    const t = (key: string, params?: Record<string, string | number>) => {
        const keys = key.split(".")
        let current: any = translations[language]
        for (const k of keys) {
            if (current) {
                current = current[k]
            }
        }
        let result = current || key
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                result = result.replace(`{${k}}`, String(v))
            })
        }
        return result
    }

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage: handleSetLanguage,
                t
            }}
        >
            {
                children
            }
        </LanguageContext.Provider>
    )
}

export const useTranslation = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error("useTranslation must be used within a LanguageProvider")
    }
    return context;
}
