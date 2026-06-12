"use client";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Navbar from "../Layouts/Navbar";
import Table from "../Table";
import { Modal } from "../ui/modal";
import { ProfileInterface } from "@/types/profile";
import { Flag } from "lucide-react";
import useAgent from "@/hooks/useAgent";
import { ChangeEvent } from "react";
import NoData from "../ui/noData";
import { useTranslation } from "@/context/LanguageContext";

const ClientAgent = ({ 
    agents,
    count,
    searchTerm
 }: {
    agents: ProfileInterface[],
    count: number,
    searchTerm: string
 }) => {
    const { t } = useTranslation();

    const {
        formData,
        search,
        setSearch,
        isModalOpen,
        setIsModalOpen,
        title,
        headers,
        tableLabels,
        body,
        handleChange,
        handleSubmit,
        handleOnClose,
        handleEdit,
        handleDelete
    } = useAgent({ 
        agents,
        searchTerm
     })

    const {
        id,
        fullName,
        emailAddress,
        phoneNumber
    } = formData;

    return (
        <div className="flex flex-col gap-5">
            <Navbar
                title={title}
                search={search}
                setSearch={setSearch}
                onAdd={() => setIsModalOpen(true)}
                listTitle={t("agents.listTitle")}
                searchPlaceholder={t("agents.searchPlaceholder")}
                addLabel={t("agents.addNew")}
                loadingLabel={t("agents.loadingData")}
            />
            {
                !count ?
                    <NoData
                        message={t("agents.noData")}
                        description=""
                    />
                :
                    <Table
                        title={title}
                        headers={headers}
                        body={body}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        count={count}
                        labels={tableLabels}
                    />
            }
            <Modal
                isOpen={isModalOpen}
                onClose={handleOnClose}
                title={id ? t("agents.form.updateTitle") : t("agents.form.addTitle")}
            >
                <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-3">
                        <label htmlFor="fullName">{t("agents.form.fullName")}</label>
                        <input
                            type="text"
                            name="fullName"
                            value={fullName}
                            onChange={handleChange}
                            required
                            className="outline-none px-4 py-2 border border-white/10 rounded-sm" 
                        />
                        <label htmlFor="emailAddress">
                            {t("agents.form.emailAddress")}
                            {
                                id &&
                                <span className="ml-1 text-xs text-white/40">
                                    {t("agents.form.emailLocked")}
                                </span>
                            }
                        </label>
                        <input
                            type="email"
                            name="emailAddress"
                            value={emailAddress}
                            onChange={handleChange}
                            className="outline-none px-4 py-2 border border-white/10 rounded-sm
                            disabled:bg-white/10 disabled:cursor-not-allowed" 
                            required
                            disabled={!!id}
                        />
                        <label htmlFor="phoneNumber">{t("agents.form.phoneNumber")}</label>
                        <PhoneInput
                            defaultCountry="US"
                            value={phoneNumber}
                            onChange={value => {
                                handleChange({ target: { name: "phoneNumber", value: value || "" } } as ChangeEvent<HTMLInputElement>)
                            }}
                            className="
                                flex items-center w-full 
                                border border-white/10 
                                rounded-sm 
                                px-3 py-2 
                                bg-transparent
                            "
                            countrySelectProps={{
                                className: "bg-black text-white p-2"
                            }}
                            numberInputProps={{
                                className: "outline-none bg-transparent"
                            }}
                            internationalIcon={() => <Flag className="w-5 h-5" />}
                        />
                    </div>
                    <div className="mt-3 w-full flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleOnClose}
                            className="w-30 h-10 flex justify-center items-center 
                            bg-white/10 rounded-sm cursor-pointer hover:opacity-80"
                        >
                            {t("agents.form.cancel")}
                        </button>
                        <button
                            className="w-30 h-10 flex justify-center items-center gap-2
                            bg-white text-black rounded-sm cursor-pointer hover:opacity-80
                            disabled:cursor-not-allowed disabled:opacity-80"
                        >
                            <span>{id ? t("agents.form.update") : t("agents.form.add")}</span>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ClientAgent;
