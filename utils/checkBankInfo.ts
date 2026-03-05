export function getCardBrand(cardNumber: string): string | null {
    const digits = cardNumber.replace(/\s/g, "");

    if (digits.length < 4) return null;

    if (/^4/.test(digits)) return "Visa";
    if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
    if (/^3[47]/.test(digits)) return "Amex";
    if (/^6(?:011|5)/.test(digits)) return "Discover";
    if (/^35(?:2[89]|[3-8])/.test(digits)) return "JCB";
    if (/^3(?:0[0-5]|[68])/.test(digits)) return "Diners";
    if (/^62/.test(digits)) return "UnionPay";

    return null;
}

export function validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s/g, "");

    if (!/^\d+$/.test(digits) || digits.length < 13 || digits.length > 19) {
        return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

export function validateExpiredDate(expiredDate: string): boolean {
    if (!/^\d{2}\/\d{2}$/.test(expiredDate)) return false;

    const [monthStr, yearStr] = expiredDate.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
}