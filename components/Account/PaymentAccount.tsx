"use client";

import { Save } from "lucide-react";
import CustomButton from "../ui/customButton";
import { updatePaymentAccount } from "@/actions/bank.action";
import { BankAccountInterface } from "@/types/payment";
import { useActionState, useEffect, useState } from "react";
import SubmitForm from "../ui/submitForm";
import { useTranslation } from "@/context/LanguageContext";
import { translateAccountMessage } from "@/utils/accountSettingsMessages";

export interface PaymentStateInterface {
    error: string | null,
    success: string | null
}

const initialState: PaymentStateInterface = {
    error: null,
    success: null
}

const PaymentAccount = ({
    paymentAccount
}: {
    paymentAccount: BankAccountInterface | null
}) => {
    const { t } = useTranslation();
    const [state, formAction] = useActionState(updatePaymentAccount, initialState);
    const [visible, setVisible] = useState(false);
    const {
        bankName = "",
        accountHolder = "",
        accountNumber = "",
        routingNumber = "",
        cardNumber = "",
        expiredDate = ""
    } = paymentAccount || {}

    const expiredDateObj = expiredDate ? new Date(expiredDate) : null;
    const formattedExpiredDate = expiredDateObj ?
        `${(expiredDateObj.getMonth() + 1).toString().padStart(2, '0')}/${expiredDateObj.getFullYear().toString().slice(2)}` : "";

    useEffect(() => {
        if (!state.error && !state.success) return;
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [state])

    return (
        <form
            className="flex flex-col gap-5"
            action={formAction}
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="bankName">{t("accountSettings.payment.bankName")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="bankName"
                    type="text"
                    defaultValue={bankName}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="accountHolder">{t("accountSettings.payment.accountHolder")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="accountHolder"
                    type="text"
                    defaultValue={accountHolder}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="accountNumber">{t("accountSettings.payment.accountNumber")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="accountNumber"
                    type="text"
                    defaultValue={accountNumber}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="routingNumber">{t("accountSettings.payment.routingNumber")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="routingNumber"
                    type="text"
                    defaultValue={routingNumber}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="cardNumber">{t("accountSettings.payment.cardNumber")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="cardNumber"
                    type="text"
                    defaultValue={cardNumber}
                    onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        let value = input.value.replace(/\D/g, '');
                        if (value.length > 16) {
                            value = value.slice(0, 16);
                        }
                        const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                        input.value = formattedValue;
                    }}
                    placeholder="4242 4242 4242 4242"
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="expiredDate">{t("accountSettings.payment.expiredDate")}</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="expiredDate"
                    type="text"
                    defaultValue={formattedExpiredDate}
                    onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        let value = input.value.replace(/\D/g, '');
                        if (value.length > 4) {
                            value = value.slice(0, 4);
                        }
                        if (value.length >= 2) {
                            value = `${value.slice(0, 2)}/${value.slice(2)}`;
                        }
                        input.value = value;
                    }}
                    placeholder="MM/YY"
                    required
                />
            </div>
            {
                visible && state.error &&
                <div className="lg:col-span-2 text-red-500 text-sm bg-red-500/10 px-4 py-2 rounded-sm">
                    {translateAccountMessage(t, state.error)}
                </div>
            }
            {
                visible && state.success &&
                <div className="lg:col-span-2 text-green-500 text-sm bg-green-500/10 px-4 py-2 rounded-sm">
                    {translateAccountMessage(t, state.success)}
                </div>
            }
            <div className="lg:col-span-2 flex justify-end mt-3">
                <SubmitForm
                    pendingMessage={t("accountSettings.payment.savingBankAccount")}
                >
                    <CustomButton
                        title={t("accountSettings.payment.saveAccount")}
                        className="w-48"
                        Icon={Save}
                    />
                </SubmitForm>
            </div>
        </form>
    )
}

export default PaymentAccount;
