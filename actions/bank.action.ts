"use server";

import { PaymentStateInterface } from "@/components/Account/PaymentAccount";
import { validateExpiredDate } from "@/utils/checkBankInfo";
import { validateCardNumber } from "@/utils/checkBankInfo";
import { getServerAuth } from "./authServer.action";
import { isUUID } from "@/utils/isUUID";
import { normalizeData } from "@/utils/normalizeData";
import { BankAccountInterface } from "@/types/payment";
import { revalidatePath } from "next/cache";

export const updatePaymentAccount = async (
    _previousState: PaymentStateInterface,
    formData: FormData
): Promise<PaymentStateInterface> => {

    const bankName = formData.get("bankName") as string;
    const accountHolder = formData.get("accountHolder") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const routingNumber = formData.get("routingNumber") as string;
    const cardNumber = formData.get("cardNumber") as string;
    const expiredDate = formData.get("expiredDate") as string;

    if (
        !bankName ||
        !accountHolder ||
        !accountNumber ||
        !routingNumber ||
        !cardNumber ||
        !expiredDate
    ) {
        return {
            error: "All fields are required",
            success: null
        }
    }

    if (!validateCardNumber(cardNumber)) {
        return {
            error: "Invalid card number",
            success: null
        }
    }

    if (!validateExpiredDate(expiredDate)) {
        return {
            error: "Invalid expired date",
            success: null
        }
    }

    const {
        supabase,
        userId
    } = await getServerAuth();

    if (!supabase || !isUUID(userId)) {
        return {
            error: "Unauthorized",
            success: null
        }
    }

    const [month, year] = expiredDate.split("/");
    const currentCentury = Math.floor(new Date().getFullYear() / 100) * 100;
    const fullYear = currentCentury + parseInt(year, 10);
    const formattedExpiredDate = `${fullYear}-${month}-01`;

    const { error } = await supabase
        .from("bank_accounts")
        .upsert({
            owner_id: userId,
            bank_name: bankName,
            account_holder: accountHolder,
            account_number: accountNumber,
            routing_number: routingNumber,
            card_number: cardNumber,
            expired_date: formattedExpiredDate
        }, { onConflict: "owner_id" });

    if (error) {
        return {
            error: error.message,
            success: null
        }
    }

    revalidatePath("/owner/settings/account");
    
    return {
        error: null,
        success: "Payment account updated successfully"
    }
}

export const getPaymentAccount = async (): Promise<BankAccountInterface> => {
    try {
        
        const {
            supabase,
            userId
        } = await getServerAuth();
    
        if (!supabase || !isUUID(userId)) throw new Error("Unauthorized");
    
        const { data, error } = await supabase
            .from("bank_accounts")
            .select("*")
            .eq("owner_id", userId)
            .maybeSingle();
    
        if (error) throw error;

        return normalizeData(data) as BankAccountInterface;
    } catch (error) {
        throw error;
    }
}