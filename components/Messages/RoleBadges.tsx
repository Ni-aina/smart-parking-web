"use client"

import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import {
    MessageRole,
    messageRoles,
    roleBadgeClass
} from "./messageRoles";

const RoleBadges = ({
    roles
}: {
    roles?: string[]
}) => {
    const { t } = useTranslation()
    const visibleRoles = (roles || []).filter((role): role is MessageRole =>
        messageRoles.includes(role as MessageRole)
    )

    if (!visibleRoles.length) return null

    return (
        <div className="mt-1 flex flex-wrap gap-1.5">
            {visibleRoles.map(role => <span
                key={role}
                className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize",
                    roleBadgeClass[role]
                )}
            >
                {t(`messages.roles.${role}`)}
            </span>)}
        </div>
    )
}

export default RoleBadges;
