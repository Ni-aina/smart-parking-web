"use client";

import { Save } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import CustomButton from "../ui/customButton";

const initForm = {
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    routingNumber: "",
    cardNumber: "",
    expiredDate: ""
}

const PaymentAccount = () => {
    const [formData, setFormData] = useState(initForm);

    const {
        bankName,
        accountHolder,
        accountNumber,
        routingNumber,
        cardNumber,
        expiredDate
    } = formData;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="bankName">Bank name *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="bankName"
                    type="text"
                    value={bankName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="accountHolder">Account holder *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="accountHolder"
                    type="text"
                    value={accountHolder}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="accountNumber">Account number *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="routingNumber">Routing number *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="routingNumber"
                    type="text"
                    value={routingNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="cardNumber">Card number *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="expiredDate">Expired date *</label>
                <input
                    className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    name="expiredDate"
                    type="text"
                    value={expiredDate}
                    onChange={handleChange}
                    required
                    placeholder="MM/YY"
                />
            </div>
            <div className="lg:col-span-2 flex justify-end mt-3">
                <CustomButton
                    title="Save account"
                    className="w-48"
                    Icon={Save}
                />
            </div>
        </form>
    )
}

export default PaymentAccount;
