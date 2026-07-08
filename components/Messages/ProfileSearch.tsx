"use client"

import { useTranslation } from "@/context/LanguageContext";
import useConversationProfiles from "@/hooks/messages/useConversationProfiles";
import { cn } from "@/lib/utils";
import { ProfileInterface } from "@/types/profile";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import Avatar from "./Avatar";
import RoleBadges from "./RoleBadges";
import {
    messageRoles,
    RoleFilter
} from "./messageRoles";

const ProfileSearch = ({
    onStart,
    isCreating
}: {
    onStart: (profile: ProfileInterface) => void
    isCreating: boolean
}) => {
    const { t } = useTranslation()
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
    const { profiles, isLoading } = useConversationProfiles(searchTerm, roleFilter)

    return (
        <div className="space-y-3 rounded-md bg-white/10 p-3 shadow-sm shadow-black/20">
            <div className="flex items-center gap-2 rounded-md bg-black/30 px-3">
                <Search size={16} className="text-white/35" />
                <input
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder={t("messages.searchPeople")}
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {(["all", ...messageRoles] as RoleFilter[]).map(role => <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={cn(
                        "cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold transition hover:bg-white/10",
                        roleFilter === role ? "bg-white text-neutral-950" : "bg-black/30 text-white/60"
                    )}
                >
                    {role === "all" ? t("messages.roles.all") : t(`messages.roles.${role}`)}
                </button>)}
            </div>
            <div className="max-h-60 space-y-2 overflow-y-auto">
                {
                    isLoading ?
                        <div className="flex items-center justify-center py-16 text-white/45">
                            <Loader2 size={18} className="animate-spin" />
                        </div> : profiles.length ? profiles.map(profile => <button
                            key={profile.id}
                            type="button"
                            disabled={isCreating}
                            onClick={() => onStart(profile)}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Avatar profile={profile} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{profile.fullName}</p>
                                <p className="truncate text-xs text-white/40">{profile.emailAddress}</p>
                                <RoleBadges roles={profile.roles} />
                            </div>
                        </button>) :
                            <p className="py-4 text-center text-sm text-white/40">
                                {t("messages.noPeopleFound")}
                            </p>
                }
            </div>
        </div>
    )
}

export default ProfileSearch;
