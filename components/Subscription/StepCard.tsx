"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubscriptionPlanInterface } from "@/types/subscription";
import { BankAccountInterface } from "@/types/payment";
import ComingSoon from "./ComingSoon";

interface CardForm {
    cardNumber: string;
    expiredDate: string;
}

interface StepCardProps {
    activePlan: SubscriptionPlanInterface;
    cardForm: CardForm;
    setCardForm: Dispatch<SetStateAction<CardForm>>;
    onSubscribe: () => void;
    isPending: boolean;
    paymentAccount: BankAccountInterface | null;
}

const StepCard = ({
    activePlan,
    cardForm,
    setCardForm,
    onSubscribe,
    isPending,
    paymentAccount
}: StepCardProps) => {

    const cleanCard = cardForm.cardNumber.replace(/\s/g, "");
    const isVisa = cleanCard.startsWith("4");
    const hasValidLength = cleanCard.length >= 13 && cleanCard.length <= 19;

    useEffect(()=> {
        if (!paymentAccount) return;

        const {
            cardNumber,
            expiredDate: expiredDateStr
        } = paymentAccount;

        const expiredDateRaw = new Date(expiredDateStr);
        
        const expiredDate = expiredDateRaw ?
        `${(expiredDateRaw.getMonth() + 1).toString().padStart(2, '0')}/${expiredDateRaw.getFullYear().toString().slice(2)}` : "";
        
        setCardForm({
            cardNumber,
            expiredDate
        })
    }, [paymentAccount])

    const {
        name,
        price,
        isActive
    } = activePlan;

    if (!isActive) return (
        <ComingSoon 
            name={name} 
            price={price} 
        />
    )

    return (
        <div className="flex flex-col gap-4">
            <div className="p-4 rounded-sm border border-white/10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-sm">
                            {name} Plan
                        </h2>
                        <p className="text-xs text-white/40 mt-1">Billed monthly</p>
                    </div>
                    <span className="text-lg font-semibold">
                        ${price}
                        <span className="text-white/40 text-xs font-normal">/mo</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <CreditCard size={14} />
                        Card number *
                    </label>
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={cardForm.cardNumber}
                            onChange={e => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length > 16) value = value.slice(0, 16);
                                const formatted = value.replace(/(.{4})/g, "$1 ").trim();
                                setCardForm(f => ({ ...f, cardNumber: formatted }));
                            }}
                            placeholder="4242 4242 4242 4242"
                            className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                        />
                        {
                            isVisa && hasValidLength &&
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider 
                                bg-white text-black px-2 py-0.5 rounded-sm"
                            >
                                Visa
                            </span>
                        }
                    </div>
                    {
                        cleanCard.length > 0 && !isVisa &&
                        <span className="text-xs text-red-400">
                            Only Visa cards are accepted (starts with 4)
                        </span>
                    }
                </div>

                <div className="flex flex-col gap-2">
                    <label>Expiry date *</label>
                    <input
                        type="text"
                        value={cardForm.expiredDate}
                        onChange={e => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 4) value = value.slice(0, 4);
                            if (value.length >= 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
                            setCardForm(f => ({ ...f, expiredDate: value }));
                        }}
                        placeholder="MM/YY"
                        className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                    />
                </div>
            </div>

            <button
                onClick={onSubscribe}
                disabled={isPending || !isVisa || !hasValidLength}
                className="mt-3 flex justify-center items-center gap-3 
                bg-white text-black w-full py-2 rounded-sm 
                cursor-pointer hover:opacity-80 
                disabled:cursor-not-allowed disabled:opacity-80"
            >
                {
                    isPending ?
                        <Loader2
                            size={16}
                            color="black"
                            className="animate-spin"
                        />
                        :
                        <CreditCard
                            size={16}
                            color="black"
                        />
                }
                <h1>Subscribe — ${activePlan.price}/mo</h1>
            </button>

            <p className="text-[10px] text-white/30 text-center">
                Your card is validated locally — Auto-subscribe on valid Visa
            </p>
        </div>
    )
}

export default StepCard;
