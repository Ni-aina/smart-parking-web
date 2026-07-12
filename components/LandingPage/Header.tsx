"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const Header = () => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const navRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <nav ref={navRef} className="sticky z-50 top-0 backdrop-blur-md flex justify-between items-center px-6 py-4 border-b border-white/10 gap-4">
            <div className="relative w-24 h-8 sm:w-36 sm:h-12">
                <Image
                    src="/images/smart-parking.png"
                    alt="Smart parking"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="eager"
                />
            </div>

            <div className="hidden sm:flex flex-1 justify-end items-center gap-6">
                <LanguageSwitcher />
                <Link
                    href="/auth/sign-in"
                    className="text-white hover:opacity-90 transition-opacity"
                >
                    {t("landing.signIn")}
                </Link>
                <Link
                    href="/auth/sign-up"
                    className="bg-white text-neutral-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    {t("landing.getStarted")}
                </Link>
            </div>

            <button
                className="sm:hidden text-white p-1"
                onClick={() => setOpen(prev => !prev)}
                aria-label="Toggle menu"
            >
                {
                    open
                        ? <X className="w-6 h-6" />
                        : <Menu className="w-6 h-6" />
                }
            </button>

            {
                open && (
                    <div className="sm:hidden absolute top-full left-0 right-0 z-50 bg-gray-950 border-b border-white/10 flex flex-col gap-4 px-6 py-4">
                        <div className="flex justify-end">
                            <LanguageSwitcher />
                        </div>
                        <Link
                            href="/auth/sign-in"
                            className="text-white text-center"
                            onClick={() => setOpen(false)}
                        >
                            {t("landing.signIn")}
                        </Link>
                        <Link
                            href="/auth/sign-up"
                            className="bg-blue-950 text-white px-4 py-2 rounded-lg text-center"
                            onClick={() => setOpen(false)}
                        >
                            {t("landing.getStarted")}
                        </Link>
                    </div>
                )
            }
        </nav>
    )
}