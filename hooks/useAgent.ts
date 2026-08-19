"use client";

import { AgentFormInterface, ProfileInterface } from "@/types/profile";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { useTranslation } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase/client";

const initForm = {
    fullName: "",
    emailAddress: "",
    phoneNumber: ""
}

const useAgent = (
    { agents, searchTerm }:
        { agents: ProfileInterface[], searchTerm: string }
) => {
    const { language, t } = useTranslation()

    const [localAgents, setLocalAgents] = useState<ProfileInterface[]>(agents)

    const [search, setSearch] = useState(searchTerm)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [resendingEmail, setResendingEmail] = useState("");
    const [formData, setFormData] = useState<AgentFormInterface>(initForm)

    const title = t("agents.title")
    const headers = [
        t("agents.headers.fullName"),
        t("agents.headers.email"),
        t("agents.headers.phone"),
        t("agents.headers.roles"),
        t("agents.headers.createdAt")
    ]

    const tableLabels = {
        all: t("agents.table.all"),
        delete: t("agents.table.delete"),
        rowsPerPage: t("agents.table.rowsPerPage"),
        actions: t("agents.table.actions"),
        confirmTitle: t("agents.confirm.title"),
        confirmMessage: t("agents.confirm.message"),
        confirmCancel: t("agents.confirm.cancel"),
        confirmConfirm: t("agents.confirm.confirm")
    }

    const body = {
        rows: localAgents.map(item => ({
            id: item.id,
            fullName: item.fullName,
            emailAddress: item.emailAddress,
            phoneNumber: item.phoneNumber,
            roles: item.roles.join(", "),
            createdAt: item.createdAt ?
                new Date(item.createdAt).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }) : ""
        })),
        cols: [
            "fullName",
            "emailAddress",
            "phoneNumber",
            "roles",
            "createdAt"
        ]
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnClose = () => {
        setFormData(initForm)
        setIsModalOpen(false)
    }

    const handleResendInvitationEmail = async (emailAddress: string) => {
        try {
            setResendingEmail(emailAddress)

            const { data: { session } } = await supabase.auth.getSession()

            const res = await fetch("/api/protected/agents/invitation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token || ""}`
                },
                body: JSON.stringify({ emailAddress })
            })

            if (!res.ok) throw new Error()
                
            toast.success(t("agents.messages.invitationSent"))
        } catch {
            toast.error(t("agents.messages.alreadyRegistered"))
        } finally {
            setResendingEmail("")
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const { id, fullName, emailAddress, phoneNumber } = formData

        if (!isValidPhoneNumber(phoneNumber)) {
            toast.error(t("agents.messages.invalidPhone"))
            return
        }

        setIsPending(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!id) {
                const res = await fetch("/api/protected/agents", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session?.access_token || ""}`
                    },
                    body: JSON.stringify({
                        fullName,
                        emailAddress,
                        phoneNumber
                    })
                })

                const result = await res.json()

                if (!res.ok) {
                    toast.error(t("agents.messages.agentCreatedError"))
                    setIsPending(false)
                    return
                }

                setLocalAgents(prev => [result.data, ...prev])
                handleOnClose()
                return
            }

            const res = await fetch("/api/protected/agents", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token || ""}`
                },
                body: JSON.stringify({
                    id,
                    fullName,
                    phoneNumber
                })
            })

            if (!res.ok) throw new Error()

            setLocalAgents(prev => prev.map(agent =>
                agent.id !== id ? agent : {
                    ...agent,
                    fullName,
                    phoneNumber
                }
            ))
            handleOnClose()
        } catch {
            toast.error(t("agents.messages.agentUpdatedError"))
        } finally {
            setIsPending(false)
        }
    }

    const handleEdit = (id: string) => {
        const agent = localAgents.filter(item => item.id === id)
            .map(({
                id,
                fullName,
                emailAddress,
                phoneNumber
            }) => ({
                id,
                fullName,
                emailAddress,
                phoneNumber
            }))?.at(0)

        if (!agent) return

        setFormData({
            id: agent.id,
            fullName: agent.fullName,
            emailAddress: agent.emailAddress,
            phoneNumber: agent.phoneNumber
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            setLocalAgents(prev => prev.filter(item => item.id !== id))

            const res = await fetch("/api/protected/agents", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token || ""}`
                },
                body: JSON.stringify({ id })
            })

            if (!res.ok) throw new Error()

        } catch (err: unknown) {
            toast.error(t("agents.messages.accessDenied"))
            setLocalAgents(localAgents)
        }
    }

    useEffect(() => {
        setLocalAgents(agents)
    }, [agents])

    return {
        formData,
        search,
        setSearch,
        isModalOpen,
        setIsModalOpen,
        isPending,
        title,
        headers,
        tableLabels,
        body,
        handleChange,
        handleResendInvitationEmail,
        resendingEmail,
        handleSubmit,
        handleOnClose,
        handleEdit,
        handleDelete
    }
}

export default useAgent;

