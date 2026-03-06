"use client";

import { AgentFormInterface, ProfileInterface } from "@/types/profile";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";

const initForm = {
    fullName: "",
    emailAddress: "",
    phoneNumber: ""
}

const useAgent = (
    { agents, searchTerm }: 
    { agents: ProfileInterface[], searchTerm: string }
) => {

    const [localAgents, setLocalAgents] = useState(agents);

    const [search, setSearch] = useState(searchTerm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<AgentFormInterface>(initForm);

    const title = "Agents";
    const headers = ["Full name", "Email", "Phone", "Roles", "Created at"];

        const isAgentOnly = (roles: string[]) =>
            roles.length === 1 && roles.includes("agent");

    const body = {
        rows: localAgents.map(item => ({
            id: item.id,
            fullName: item.fullName,
            emailAddress: item.emailAddress,
            phoneNumber: item.phoneNumber,
            roles: item.roles.join(", "),
            createdAt: item.createdAt ?
                new Date(item.createdAt).toLocaleDateString([], {
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOnClose = () => {
        setFormData(initForm);
        setIsModalOpen(false);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { id, phoneNumber } = formData;

        if (!isValidPhoneNumber(phoneNumber)) {
            toast.error("Invalid phone number");
            return;
        }

        if (!id) {
            const newAgent: ProfileInterface = {
                id: crypto.randomUUID(),
                roles: ["agent"],
                fullName: formData.fullName,
                emailAddress: formData.emailAddress,
                phoneNumber: formData.phoneNumber,
                createdAt: new Date().toISOString()
            }
            setLocalAgents(prev => [newAgent, ...prev]);
            setFormData(initForm);
            setIsModalOpen(false);
            return;
        }

        setLocalAgents(prev => prev.map(agent =>
            agent.id !== id ? agent : {
                ...agent,
                fullName: formData.fullName,
                emailAddress: formData.emailAddress,
                phoneNumber: formData.phoneNumber
            }
        ))
        handleOnClose();
    }

    const handleEdit = (id: string) => {
        const agent = localAgents.filter(item => item.id === id)
            .map(({
                id,
                fullName,
                emailAddress,
                phoneNumber,
            }) => ({
                id,
                fullName,
                emailAddress,
                phoneNumber
            }))?.at(0);

        if (!agent) return;
        
        setFormData({
            id: agent.id,
            fullName: agent.fullName,
            emailAddress: agent.emailAddress,
            phoneNumber: agent.phoneNumber
        })
        setIsModalOpen(true);
    }

    const handleDelete = (id: string) => {
        const agent = localAgents.find(item => item.id === id);
        if (!agent || !isAgentOnly(agent.roles)){
            toast.error("Only agents can be deleted");
            return;
        }

        setLocalAgents(prev => prev.filter(item => item.id !== id));
    }

    useEffect(()=> {
        setLocalAgents(agents);
    }, [agents])

    return {
        formData,
        search,
        setSearch,
        isModalOpen,
        setIsModalOpen,
        title,
        headers,
        body,
        handleChange,
        handleSubmit,
        handleOnClose,
        handleEdit,
        handleDelete
    }
}

export default useAgent;
